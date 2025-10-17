import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function Detail(){
  const { id } = useParams()
  const nav = useNavigate()
  const [item, setItem] = useState(null)

  useEffect(()=>{
    fetch('/data.json').then(r=>r.json()).then(list=>{
      setItem(list.find(x=> String(x.id) === String(id)))
    })
  }, [id])

  if(!item) return <div className="container"><p>Cargando…</p></div>

  return (
    <div className="container">
      <button className="button secondary" onClick={()=>nav(-1)}>← Volver</button>
      <div className="grid2" style={{marginTop:12}}>
        <img src={item.foto} alt={item.nombre} style={{width:'100%',borderRadius:12}}/>
        <div>
          <h2>{item.nombre}</h2>
          <div>{item.ubicacion} • {item.experiencia} años</div>
          <div style={{margin:'6px 0'}}><strong>Tarifa:</strong> {item.tarifa} €/h</div>
          <div style={{margin:'6px 0'}}><strong>Disponibilidad:</strong> {item.disponibilidad}</div>
          <div style={{margin:'6px 0'}}><strong>Certificaciones:</strong> {Array.isArray(item.certificaciones) ? item.certificaciones.join(', ') : item.certificaciones}</div>
          <p>{item.descripcion}</p>
          <p><span className="star">★</span> {item.valoracion_promedio} <small>({item.num_resenas} reseñas)</small></p>
          <a className="button" href={`mailto:contacto@example.com?subject=Interés en ${encodeURIComponent(item.nombre)}`}>Contactar</a>
        </div>
      </div>
    </div>
  )
}
