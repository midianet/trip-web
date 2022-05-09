import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {alertService} from '../services'

function PaymentList() {
    const [data , setData]  = useState([])
    const [page , setPage]  = useState(1)
    const [pages, setPages] = useState(0)    
    const [total, setTotal] = useState(0)
    const [size , setSize]  = useState(10)

    useEffect(() => {
        loadData()
    }, [page])

    function loadData(){
        fetch(`${process.env.REACT_APP_API}/payment?page=${page-1}&size=${size}`)
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
            alertService.error("Erro ao listar Pagamentos")
        })
    }

    function _delete(id) {
       setData(data.map(element => {
            if (element.id === id) { element.isDeleting = true; }
            return element;
        }))
        fetch(`${process.env.REACT_APP_API}/payment/${id}`, { method: 'DELETE' })
        .then(response => {
            if(response.status === 204){
                let tot = total - 1;
                let pgs = tot % size === 0 ? pages -1 : pages
                let pg = pages > pgs ? pgs : pages;
                setPages(pgs)
                setPage(pg)
                setTotal(tot)
                setData(dt => dt.filter(element => element.id !== id))                
                return alertService.success('Pagamento removido com sucesso')
            } 
            throw response
        })
        .catch(err => {
            console.log(err)
            alertService.error("Erro ao remover Pagamento")
        })
    }

    return (
        <div className="container-fluid">
            <h1>Pagamentos</h1>
            <Link to="/pagamento/novo" className="btn btn-sm btn-success mb-2">Novo Pagamento</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Família</th>
                        <th style={{ width: '150px' }}>Data</th>
                        <th style={{ width: '150px' }}>Valor</th>
                        <th style={{ width: '100px' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map(payment =>
                        <tr key={payment.id}>
                            <td>{payment.family?.name}</td>
                            <td>{payment.date}</td>
                            <td>{payment.amount}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`/payment/${payment.id}`} className="btn btn-sm btn-primary mr-1">Editar</Link>
                                <button style={{marginLeft: '8px'}}  onClick={() => _delete(payment.id)} className="btn btn-sm btn-danger btn-delete-user" disabled={payment.isDeleting}>
                                    {payment.isDeleting 
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
                                <div className="p-2">Nenhum Pagamento Cadastrado</div>
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

export { PaymentList }