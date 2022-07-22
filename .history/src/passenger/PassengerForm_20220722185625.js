import React, { useEffect, useState} from 'react'
import { Link, useParams, useNavigate} from 'react-router-dom'
import { Controller, useForm, useWatch } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import Select from "react-select"
import DatePicker from "react-datepicker"
import * as Yup from 'yup'

import "react-datepicker/dist/react-datepicker.css"

import {alertService} from '../services'

function PassengerForm() {
    let { id } = useParams()
    let navigate = useNavigate()
    const isAddMode = !id
    const [families , setFamilies]  = useState([])
    const [loaded,setLoaded] = useState(false)
    const [startDate, setStartDate] = useState(new Date());

    const statusList = [
        { value: 'INTERESTED', label: "Interessado" },
        { value: 'ASSOCIATED', label: "Associado" },
        { value: 'CONFIRMED', label: "Confirmado" }
      ];

    const validationScheme = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
        status: Yup.string().required('Status é obrigatório')
    })

    const {control, register, handleSubmit, watch, reset, setValue, formState: { errors, isSubmitting }} = useForm({
        resolver: yupResolver(validationScheme)
    });

    useEffect(() => {
        loadFamilies()
    }, [])

    useEffect(() =>{
        loadPassenger()
    },[families])

    function onSubmit(data) {
        return isAddMode ? create(data) : update(id, data)
    }

    function create(data) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }

        fetch(`${process.env.REACT_APP_API}/passenger`,requestOptions )
        .then(response => {
            if(response.status === 201) {
                alertService.success('Passageiro criado com sucesso', { keepAfterRouteChange: true })
                return navigate("/passageiro")
            }
            throw response
        })
        .catch(err => {
            console.log(err)
            alertService.error("Erro ao cadastrar Passageiro")
        })
    }

    function update(updateId, data) {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        fetch(`${process.env.REACT_APP_API}/passenger/${updateId}`,requestOptions )
        .then(response => {
            if(response.ok) {
                alertService.success('Passageiro alterado com sucesso', { keepAfterRouteChange: true })
                return navigate("/passageiro")
            }
            throw response
        })
        .catch(err => {
            console.log(err)
            alertService.error("Erro ao alterar Passageiro")
        })
    }

    function loadPassenger(){
        if (!isAddMode) {
            fetch(`${process.env.REACT_APP_API}/passenger/${id}`)
            .then(response => {
                if(response.ok) return response.json()
                throw response
            })
            .then(response => {
                const fields = ['name','status','family','rg']
                fields.forEach(field => setValue(field, response[field]))
                setValue('birthdate', response.birthdate ? new Date(response.birthdate) : null)
            })
            .catch(err => {
                console.log(err)
                alertService.error("Erro ao obter Passageiro")
            })
        }
    }

    function loadFamilies(){
        fetch(`${process.env.REACT_APP_API}/family?size=-1`)
        .then(response => {
            if(response.ok) return response.json()
            throw response
        })
        .then(response => {
            setFamilies(response.content)
            setLoaded(true)
        })
        .catch(err => {
            console.log(err)
            setLoaded(true)
            alertService.error("Erro ao listar Famílias")
        })
    }

    return (
        loaded ? (
            <div className="container-fluid">
                <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
                    <h1>{isAddMode ? 'Novo Passageiro' : 'Edição de Passageiro'}</h1>
                    <div className="row">
                        <div className="form-group col-6">
                            <label>Nome</label>
                            <input type="text" maxLength="20" {...register("name")} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.name?.message}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-3">
                            <label>Status</label>
                            <Controller control={control} name="status"
                            rules={{ required: true }}
                            render={({field}) => (
                                <select {...field} 
                                     value={statusList.find(e => e.value === field.value)} 
                                     className={`form-select ${errors.name ? 'is-invalid' : ''}`} 
                                     onChange={(e) => setValue('status', e.value)}>
                                    {statusList.map((option) => (<option value={option.value}>{option.label}</option>))}
                                </select>
                            )}/>
                            <div className="invalid-field">{errors.status?.message}</div>
                        </div>
                        <div className="form-group col-3">
                            <label>Família</label>

                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-2">
                            <label>RG</label>
                            <input type="text" maxLength="101" {...register("rg")} className={`form-control ${errors.rg ? 'is-invalid' : ''}`} />
                        </div>
                        <div className="form-group col-2">
                            <label>CPF</label>
                            <input type="text" maxLength="101" {...register("cpf")} className={`form-control ${errors.cpf ? 'is-invalid' : ''}`} />
                        </div>
                        <div className="form-group col-2">
                            <label>Nascimento</label>

                        </div>
                    </div>
                    <div className="form-row mt-2">
                        <div className="form-group">
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Salvar
                            </button>
                            <Link to="/passageiro" className="btn btn-warning mx-2">Cancelar</Link>
                        </div>
                    </div>
                </form>
            </div>
        ) : <div></div>
    )
}

export { PassengerForm }