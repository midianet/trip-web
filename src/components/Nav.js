import React from 'react'
import { Link } from "react-router-dom"


function Nav() {
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav">
                <Link to="/" className="nav-item nav-link">Home</Link>
                <Link to="/passageiro" className="nav-item nav-link">Passageiros</Link>                
                <Link to="/familia" className="nav-item nav-link">Famílias</Link>
                <Link to="/pagamento" className="nav-item nav-link">Pagamentos</Link>
            </div>
        </nav>
    )
}

export { Nav }