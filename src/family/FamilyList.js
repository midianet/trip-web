import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {alertService} from '../services'

function FamilyList() {
    const [data , setData]  = useState([])
    const [page , setPage]  = useState(1)
    const [pages, setPages] = useState(0)    
    const [total, setTotal] = useState(0)
    const [size , setSize]  = useState(10)


    useEffect(() => {
        loadData()
    }, [page])

    function loadData(){
        fetch(`${process.env.REACT_APP_API}/family?page=${page-1}&size=${size}`)
        .then(response => {
            if(response.ok) return response.json()
            throw response
        })
        .then(response => {
            setData(response.content)
            setPages(parseInt(response.totalPages))
            setTotal(parseInt(response.totalElements))
        })
        .catch(err => {
            console.log(err)
            alertService.error("Erro ao listar Famílias")
        })
    }
    
    function _delete(id) {
       setData(data.map(element => {
            if (element.id === id) { element.isDeleting = true; }
            return element;
        }))
        fetch(`${process.env.REACT_APP_API}/family/${id}`, { method: 'DELETE' })
        .then(response => {
            if(response.status === 204){
                let tot = total - 1;
                let pgs = tot % size === 0 ? pages -1 : pages
                let pg = pages > pgs ? pgs : pages;
                setPages(pgs)
                setPage(pg)
                setTotal(tot)
                setData(data => data.filter(element => element.id !== id))                
                return alertService.success('Família removida com sucesso')
            } 
            throw response
        })
        .catch(err => {
            console.log(err)
            alertService.error("Erro ao remover Família")
        })
    }

    return (
        <div className="container-fluid">
            <h1>Famílias</h1>
            <Link to="/familia/novo" className="btn btn-sm btn-success mb-2">Nova Família</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th style={{ width: '100px' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map(family =>
                        <tr key={family.id}>
                            <td>{family.name}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`/familia/${family.id}`} className="btn btn-sm btn-primary mr-1">Editar</Link>
                                <button style={{marginLeft: '8px'}}  onClick={() => _delete(family.id)} className="btn btn-sm btn-danger btn-delete-user" disabled={family.isDeleting}>
                                    {family.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span> Deletar</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {!data &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="spinner-border spinner-border-lg align-center"></div>
                            </td>
                        </tr>
                    }
                    {data && !data.length &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="p-2">Nenhuma Familia Cadastrada</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
            <div style={{display: 'flex', justifyContent: 'left'}}>
                <nav aria-label="Navegação">
                    <ul className="pagination">
                        <li className="page-item"><button className={`page-link ${page === 1     ? 'disable-page-link' : ''}`} onClick={() => setPage(1)}>Primeira</button></li>
                        <li className="page-item"><button className={`page-link ${page === 1     ? 'disable-page-link' : ''}`} onClick={() => setPage(page - 1)}>Anterior</button></li>
                        <li className="page-item"><button className={`page-link ${page === pages ? 'disable-page-link' : ''}`} onClick={() => setPage(page + 1)}>Próxima</button></li>
                        <li className="page-item"><button className={`page-link ${page === pages ? 'disable-page-link' : ''}`} onClick={() => setPage(pages)}>Última</button></li>
                    </ul>
                </nav>
                <div className='px-2 pt-2' >
                    Página <span className="font-weight-bold">{page}</span> de <span className="font-weight-bold">{pages}</span>  -   Registros({total})
                </div>
            </div>
        </div>
    )
}

export { FamilyList }