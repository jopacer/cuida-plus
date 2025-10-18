import { neon } from "@netlify/neon";

const sql = neon();

export default async (req, context) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const cuidadores = await sql`
      SELECT * FROM cuidadores
      ORDER BY created_at DESC
    `

    return Response.json({ ok: true, data: cuidadores })
  } catch (error) {
    console.error('Error al obtener cuidadores:', error)
    return Response.json({ ok: false, error: error.message }, { status: 500 })
  }
}
