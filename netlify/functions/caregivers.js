import { neon } from "@netlify/neon";

const sql = neon();

export default async (req) => {
  if (req.method === "GET") {
    const caregivers = await sql`
      SELECT 
        c.*,
        COALESCE(AVG(r.valoracion), 0) as valoracion_promedio,
        COUNT(r.id) as num_resenas
      FROM caregivers c
      LEFT JOIN reviews r ON c.id = r.caregiver_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `;
    return Response.json(caregivers);
  }

  if (req.method === "POST") {
    const body = await req.json();
    const { nombre, apellidos, telefono, ubicacion, experiencia, certificaciones, tarifa, disponibilidad, descripcion, foto } = body;

    const [caregiver] = await sql`
      INSERT INTO caregivers (nombre, apellidos, telefono, ubicacion, experiencia, certificaciones, tarifa, disponibilidad, descripcion, foto)
      VALUES (${nombre}, ${apellidos}, ${telefono}, ${ubicacion}, ${experiencia}, ${certificaciones}, ${tarifa}, ${disponibilidad}, ${descripcion}, ${foto})
      RETURNING *
    `;

    return Response.json(caregiver);
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = {
  path: "/api/caregivers"
};
