import { neon } from "@netlify/neon";

const sql = neon();

export default async (req) => {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (req.method === "GET") {
    const [caregiver] = await sql`
      SELECT 
        c.*,
        COALESCE(AVG(r.valoracion), 0) as valoracion_promedio,
        COUNT(r.id) as num_resenas
      FROM caregivers c
      LEFT JOIN reviews r ON c.id = r.caregiver_id
      WHERE c.id = ${id}
      GROUP BY c.id
    `;

    if (!caregiver) {
      return new Response("Caregiver not found", { status: 404 });
    }

    const reviews = await sql`
      SELECT r.*, cl.nombre as client_nombre
      FROM reviews r
      JOIN clients cl ON r.client_id = cl.id
      WHERE r.caregiver_id = ${id}
      ORDER BY r.created_at DESC
    `;

    return Response.json({ ...caregiver, reviews });
  }

  if (req.method === "PUT") {
    const body = await req.json();
    const { nombre, apellidos, telefono, ubicacion, experiencia, certificaciones, tarifa, disponibilidad, descripcion, foto } = body;

    const [caregiver] = await sql`
      UPDATE caregivers
      SET nombre = ${nombre}, apellidos = ${apellidos}, telefono = ${telefono}, 
          ubicacion = ${ubicacion}, experiencia = ${experiencia}, 
          certificaciones = ${certificaciones}, tarifa = ${tarifa}, 
          disponibilidad = ${disponibilidad}, descripcion = ${descripcion}, foto = ${foto}
      WHERE id = ${id}
      RETURNING *
    `;

    if (!caregiver) {
      return new Response("Caregiver not found", { status: 404 });
    }

    return Response.json(caregiver);
  }

  if (req.method === "DELETE") {
    await sql`DELETE FROM caregivers WHERE id = ${id}`;
    return Response.json({ success: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = {
  path: "/api/caregivers/:id"
};
