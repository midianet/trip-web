import React from 'react'
import { Routes, Route} from "react-router-dom"
import { Nav, Alert } from './components'
import { Home } from './home'
import {FamilyList, FamilyForm } from './family'
import {PassengerList, PassengerForm } from './passenger'
import {PaymentList} from './payment';
import {setDefaultLocale } from  "react-datepicker"
import pt from 'date-fns/locale/pt'

import './App.css';

function App() {
  setDefaultLocale(pt)
  return (
    <div className="app-container">
        <Nav />
        <Alert />
        <div>
          <Routes>
            <Route path="/familia/:id" element={<FamilyForm /> }/>
            <Route exact path="/familia/novo" element={<FamilyForm />} />
            <Route exact path="/familia" element={<FamilyList />} />
            <Route path="/passageiro/:id" element={<PassengerForm /> }/>
            <Route exact path="/passageiro/novo" element={<PassengerForm />} />
            <Route exact path="/passageiro" element={<PassengerList />} />
            <Route exact path="/pagamento" element={<PaymentList />} />
            <Route exact path="/" element={<Home />} />
          </Routes>
        </div>
    </div>
  )
}

export default App
