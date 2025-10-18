import { neon } from "@netlify/neon";

const sql = neon();

export default async (req) => {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (req.method === "GET") {
    const [client] = await sql`
      SELECT * FROM clients WHERE id = ${id}
    `;

    if (!client) {
      return new Response("Client not found", { status: 404 });
    }

    const interventions = await sql`
      SELECT i.*, c.nombre as caregiver_nombre, c.foto as caregiver_foto
      FROM interventions i
      JOIN caregivers c ON i.caregiver_id = c.id
      WHERE i.client_id = ${id}
      ORDER BY i.fecha_programada DESC
    `;

    return Response.json({ ...client, interventions });
  }

  if (req.method === "PUT") {
    const body = await req.json();
    const { nombre, apellidos, telefono, direccion, fecha_nacimiento, notas_medicas } = body;

    const [client] = await sql`
      UPDATE clients
      SET nombre = ${nombre}, apellidos = ${apellidos}, telefono = ${telefono}, 
          direccion = ${direccion}, fecha_nacimiento = ${fecha_nacimiento}, 
          notas_medicas = ${notas_medicas}
      WHERE id = ${id}
      RETURNING *
    `;

    if (!client) {
      return new Response("Client not found", { status: 404 });
    }

    return Response.json(client);
  }

  if (req.method === "DELETE") {
    await sql`DELETE FROM clients WHERE id = ${id}`;
    return Response.json({ success: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = {
  path: "/api/clients/:id"
};
