import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Detail from './pages/Detail.jsx'
import NewCaregiver from './pages/NewCaregiver.jsx'

export default function App(){
  const nav = useNavigate()
  return (
    <div>
      <header className="header">
        <div className="brand">CUIDA+</div>
        <nav style={{display:'flex', gap:8}}>
          <button className="button secondary" onClick={()=>nav('/')}>Cuidadores</button>
          <button className="button" onClick={()=>nav('/new')}>+ Add</button>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/caregivers/:id" element={<Detail />} />
        <Route path="/new" element={<NewCaregiver />} />
      </Routes>
      <footer className="footer">© {new Date().getFullYear()} CUIDA+</footer>
    </div>
  )
}
