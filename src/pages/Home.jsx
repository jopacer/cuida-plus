import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [loc, setLoc] = useState('')
  const [minExp, setMinExp] = useState(0)

  useEffect(()=>{
    fetch('/api/caregivers').then(r=>r.json()).then(setItems)
  }, [])

  const locations = useMemo(()=> Array.from(new Set(items.map(i=>i.ubicacion))).sort(), [items])

  const filtered = items.filter(i=>
    (!q || i.nombre.toLowerCase().includes(q.toLowerCase())) &&
    (!loc || i.ubicacion === loc) &&
    (Number(i.experiencia) >= Number(minExp))
  )

  return (
    <div className="container">
      <h1>Listado de cuidadores</h1>
      <div className="toolbar">
        <input placeholder="Buscar por nombre…" value={q} onChange={e=>setQ(e.target.value)}/>
        <select value={loc} onChange={e=>setLoc(e.target.value)}>
          <option value="">Todas las ubicaciones</option>
          {locations.map(l=> <option key={l} value={l}>{l}</option>)}
        </select>
        <input type="number" min="0" placeholder="Mín. años exp." value={minExp} onChange={e=>setMinExp(e.target.value)}/>
      </div>

      <div className="list">
        {filtered.map(item => (
          <article key={item.id} className="card">
            <img src={item.foto} alt={item.nombre} onError={(ev)=>{ev.currentTarget.src='https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800'}} />
            <h3>{item.nombre}</h3>
            <div>
              <span className="badge">{item.ubicacion}</span>
              <span className="badge">{item.experiencia} años</span>
            </div>
            <p><strong>{item.tarifa} €/h</strong></p>
            <p>
              <span className="star">★</span> {item.valoracion_promedio} <small>({item.num_resenas} reseñas)</small>
            </p>
            <Link className="button" to={`/caregivers/${item.id}`}>Ver perfil</Link>
          </article>
        ))}
      </div>
    </div>
  )
}
