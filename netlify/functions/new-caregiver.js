import { neon } from "@netlify/neon";

const sql = neon();

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const body = await req.json()

    const certificaciones = Array.isArray(body.certificaciones) 
      ? body.certificaciones 
      : String(body.certificaciones || '').split(';').map(s=>s.trim()).filter(Boolean)

    const result = await sql`
      INSERT INTO cuidadores (
        nombre, ubicacion, experiencia, certificaciones, tarifa,
        disponibilidad, descripcion, valoracion_promedio, num_resenas, foto
      ) VALUES (
        ${body.nombre},
        ${body.ubicacion},
        ${body.experiencia || 0},
        ${certificaciones},
        ${body.tarifa || 0},
        ${body.disponibilidad || ''},
        ${body.descripcion || ''},
        ${body.valoracion_promedio || 0},
        ${body.num_resenas || 0},
        ${body.foto || ''}
      )
      RETURNING *
    `

    return Response.json({ ok: true, data: result[0] })
  } catch (error) {
    console.error('Error al crear cuidador:', error)
    return Response.json({ ok: false, error: error.message }, { status: 500 })
  }
}
