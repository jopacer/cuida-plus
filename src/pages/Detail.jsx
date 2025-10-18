import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function Detail(){
  const { id } = useParams()
  const nav = useNavigate()
  const [item, setItem] = useState(null)

  useEffect(()=>{
    fetch(`/api/caregivers/${id}`).then(r=>r.json()).then(setItem)
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
          {item.reviews && item.reviews.length > 0 && (
            <div style={{marginTop:20}}>
              <h3>Reseñas</h3>
              {item.reviews.map(review => (
                <div key={review.id} style={{borderLeft:'3px solid #e0e0e0', paddingLeft:12, marginBottom:12}}>
                  <div><strong>{review.client_nombre}</strong> • <span className="star">★</span> {review.valoracion}</div>
                  {review.comentario && <p style={{fontSize:'0.9em',margin:'4px 0'}}>{review.comentario}</p>}
                  <small style={{color:'#666'}}>{new Date(review.created_at).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          )}
          <a className="button" href={`mailto:contacto@example.com?subject=Interés en ${encodeURIComponent(item.nombre)}`}>Contactar</a>
        </div>
      </div>
    </div>
  )
}
