import React, { useEffect} from 'react'
import { Link, useParams, useNavigate} from 'react-router-dom'
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import {alertService} from '../services'

function FamilyForm() {
    let { id } = useParams()
    let navigate = useNavigate()
    const isAddMode = !id
    
    // form validation rules 
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório')
    })

    // functions to build form returned by useForm() hook
    const { register, handleSubmit, reset, setValue, errors, formState } = useForm({
        resolver: yupResolver(validationSchema)
    })

    function onSubmit(data) {
        return isAddMode ? create(data) : update(id, data)
    }

    function create(data) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }

        fetch(`${process.env.REACT_APP_API}/family`,requestOptions )
        .then(response => {
            if(response.status === 201) {
                alertService.success('Família criada com sucesso', { keepAfterRouteChange: true })
                return navigate("/familia")
            }
            throw response
        })
        .catch(err => {
            console.log(err)
            alertService.error("Erro ao cadastrar Família")
        })
    }

    function update(id, data) {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        fetch(`${process.env.REACT_APP_API}/family/${id}`,requestOptions )
        .then(response => {
            if(response.ok) {
                alertService.success('Família alterada com sucesso', { keepAfterRouteChange: true })
                return navigate("/familia")
            }
            throw response
        })
        .catch(err => {
            console.log(err)
            alertService.error("Erro ao alterar Família")
        })
    }

    useEffect(() => {
        if (!isAddMode) {
            fetch(`${process.env.REACT_APP_API}/family/${id}`)
            .then(response => {
                if(response.ok) return response.json()
                throw response
            })
            .then(response => {
                const fields = ['name'];
                fields.forEach(field => setValue(field, response[field]));
            })
            .catch(err => {
                console.log(err)
                alertService.error("Erro ao obter Família")
            })
        }
    }, [])

    return (
        <div className="container-fluid">
            <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
                <h1>{isAddMode ? 'Nova Família' : 'Edição de Família'}</h1>
                <div className="row">
                    <div className="form-group col-5">
                        <label>Nome</label>
                        <input name="name" type="text" maxLength="20" ref={register} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.name?.message}</div>
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="form-group">
                        <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary">
                            {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Salvar
                        </button>
                        <Link to="/familia" className="btn btn-warning mx-2">Cancelar</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

export { FamilyForm }