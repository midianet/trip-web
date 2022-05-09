import React, { useEffect, useState} from 'react'
import { Link, useParams, useNavigate} from 'react-router-dom'
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import Select from "react-select"
import DatePicker from "react-datepicker"
import * as Yup from 'yup'

import "react-datepicker/dist/react-datepicker.css"

import {alertService} from '../services'

function PaymentForm() {
    let { id } = useParams()
    let navigate = useNavigate()
    const isAddMode = !id
    const [families , setFamilies]  = useState([])
    const [loaded,setLoaded] = useState(false)
    const [startDate, setStartDate] = useState(new Date());

    const validationSchema = Yup.object().shape({
        family: Yup.object.required('Família é obrigatório'),
        amount: Yup.string().required('Valor é obrigatório'),
        date: Yup.string().required('Data é obrigatória')
    })

    const { register, handleSubmit, reset, setValue, errors, formState, control } = useForm({
        resolver: yupResolver(validationSchema)
    })

    useEffect(() => {
        loadFamilies()
    }, [])

    useEffect(() =>{
        loadPayment()
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

        fetch(`${process.env.REACT_APP_API}/payment`,requestOptions )
        .then(response => {
            if(response.status === 201) {
                alertService.success('Pagamento criado com sucesso', { keepAfterRouteChange: true })
                return navigate("/pagamento")
            }
            throw response
        })
        .catch(err => {
            console.log(err)
            alertService.error("Erro ao cadastrar Pagamento")
        })
    }

    function update(updateId, data) {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        fetch(`${process.env.REACT_APP_API}/payment/${updateId}`,requestOptions )
        .then(response => {
            if(response.ok) {
                alertService.success('Pagamento alterado com sucesso', { keepAfterRouteChange: true })
                return navigate("/pagamento")
            }
            throw response
        })
        .catch(err => {
            console.log(err)
            alertService.error("Erro ao alterar Pagamento")
        })
    }

    function loadPayment(){
        if (!isAddMode) {
            fetch(`${process.env.REACT_APP_API}/payment/${id}`)
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
                            <input name="name" type="text" maxLength="20" ref={register} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.name?.message}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-3">
                            <label>Status</label>
                            <select name="status" defaultValue="" ref={register} className={`form-select ${errors.status ? 'is-invalid' : ''}`}>
                                <option selected>Selecione</option>
                                <option key="INTERESTED" value="INTERESTED">Interessado</option>
                                <option key="ASSOCIATED" value="ASSOCIATED">Associado</option>
                                <option key="CONFIRMED" value="CONFIRMED">Confirmado</option>
                            </select>
                            {/* <Controller name="status" control={control} defaultValue="" ref={register} className={`form-select ${errors.status ? 'is-invalid' : ''}`} render={props =>
                                <Select placeholder="Selecione..."
                                        options={statusList}
                                        ref={props.ref}
                                        inputRef={props.ref}
                                        getOptionLabel={option => option.label}
                                        getOptionValue={option => option.value}
                                        value={props.value}
                                        onChange={e => props.onChange(e)}/>
                            } /> */}
                            <div className="invalid-feedback">{errors.status?.message}</div>
                        </div>
                        <div className="form-group col-3">
                            <label>Família</label>
                            <Controller name="family" control={control} defaultValue="" render={props =>
                                <Select placeholder="Selecione..."
                                        options={families}
                                        getOptionLabel={option => option.name}
                                        getOptionValue={option => option}
                                        value={props.value}
                                        onChange={e => props.onChange(e)}/>
                            } />
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-2">
                            <label>RG</label>
                            <input name="rg" type="text" maxLength="101" ref={register} className={`form-control ${errors.rg ? 'is-invalid' : ''}`} />
                        </div>
                        <div className="form-group col-2">
                            <label>CPF</label>
                            <input name="cpf" type="text" maxLength="101" ref={register} className={`form-control ${errors.cpf ? 'is-invalid' : ''}`} />
                        </div>
                        <div className="form-group col-2">
                            <label>Nascimento</label>
                            <Controller name="birthdate" control={control} defaultValue="" render={props =>
                                <DatePicker className='form-control' dateFormat="dd/MM/yyyy"  
                                selected={props.value} 
                                onChange={e => props.onChange(e)} />
                            } />
                        </div>
                    </div>
                    <div className="form-row mt-2">
                        <div className="form-group">
                            <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary">
                                {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
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

export { PaymentForm }