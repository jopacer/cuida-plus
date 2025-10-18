import React, { useState } from 'react'

export default function NewCaregiver(){
  const [form, setForm] = useState({
    nombre:'', apellidos:'', telefono:'', ubicacion:'', experiencia:0, tarifa:0,
    disponibilidad:'', certificaciones:'', descripcion:'', foto:''
  })
  const [result, setResult] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    try{
      const formData = {
        ...form,
        certificaciones: form.certificaciones.split(';').map(s=>s.trim()).filter(Boolean)
      }
      const res = await fetch('/api/caregivers', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(formData)
      })
      if(res.ok){
        const data = await res.json()
        setResult({ok:true, data})
      }else{
        const txt = await res.text()
        setResult({ok:false, error: txt})
      }
    }catch(err){
      setResult({ok:false, error:'Sin backend. Copia este JSON:\n' + JSON.stringify(form, null, 2)})
    }
  }

  const bind = (k)=>(e)=> setForm(s=>({...s, [k]: e.target.value}))

  return (
    <div className="container">
      <h1>Añadir cuidador</h1>
      <form onSubmit={onSubmit} className="grid2">
        <input placeholder="Nombre" value={form.nombre} onChange={bind('nombre')} required/>
        <input placeholder="Apellidos" value={form.apellidos} onChange={bind('apellidos')}/>
        <input placeholder="Teléfono" value={form.telefono} onChange={bind('telefono')}/>
        <input placeholder="Ubicación" value={form.ubicacion} onChange={bind('ubicacion')} required/>
        <input type="number" min="0" placeholder="Experiencia (años)" value={form.experiencia} onChange={bind('experiencia')} required/>
        <input type="number" min="0" step="0.5" placeholder="Tarifa €/h" value={form.tarifa} onChange={bind('tarifa')} required/>
        <input placeholder="Disponibilidad" value={form.disponibilidad} onChange={bind('disponibilidad')}/>
        <input placeholder="Certificaciones (separadas por ;)" value={form.certificaciones} onChange={bind('certificaciones')}/>
        <input placeholder="URL Foto" value={form.foto} onChange={bind('foto')}/>
        <textarea placeholder="Descripción" value={form.descripcion} onChange={bind('descripcion')} rows="4"/>
        <button className="button" type="submit">Guardar</button>
      </form>
      {result && (
        <pre style={{whiteSpace:'pre-wrap', background:'#f8fafc', padding:12, borderRadius:12, marginTop:12}}>
{typeof result.error === 'string' ? result.error : JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}
