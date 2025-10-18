import { neon } from "@netlify/neon";

const sql = neon();

export default async (req) => {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (req.method === "GET") {
    const [intervention] = await sql`
      SELECT i.*, c.nombre as caregiver_nombre, cl.nombre as client_nombre
      FROM interventions i
      JOIN caregivers c ON i.caregiver_id = c.id
      JOIN clients cl ON i.client_id = cl.id
      WHERE i.id = ${id}
    `;

    if (!intervention) {
      return new Response("Intervention not found", { status: 404 });
    }

    return Response.json(intervention);
  }

  if (req.method === "PUT") {
    const body = await req.json();
    const { fecha_programada, fecha_inicio, fecha_fin, estado, notas } = body;

    const [intervention] = await sql`
      UPDATE interventions
      SET fecha_programada = ${fecha_programada}, fecha_inicio = ${fecha_inicio}, 
          fecha_fin = ${fecha_fin}, estado = ${estado}, notas = ${notas}
      WHERE id = ${id}
      RETURNING *
    `;

    if (!intervention) {
      return new Response("Intervention not found", { status: 404 });
    }

    return Response.json(intervention);
  }

  if (req.method === "DELETE") {
    await sql`DELETE FROM interventions WHERE id = ${id}`;
    return Response.json({ success: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = {
  path: "/api/interventions/:id"
};
