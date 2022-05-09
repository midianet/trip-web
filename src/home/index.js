import React from 'react'
import './home.css'

function Home() {
    return (
        <div style={{backgroundImage: `url('/images/background.jpg')`}} className='background'>
            <div className='container-fluid content-home'>
                <h1>Bem vindo ao Controle de Viagem Familiar</h1> 
            </div>
        </div>
    );
}
export { Home }