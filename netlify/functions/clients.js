import { neon } from "@netlify/neon";

const sql = neon();

export default async (req) => {
  if (req.method === "GET") {
    const clients = await sql`
      SELECT * FROM clients ORDER BY created_at DESC
    `;
    return Response.json(clients);
  }

  if (req.method === "POST") {
    const body = await req.json();
    const { nombre, apellidos, telefono, direccion, fecha_nacimiento, notas_medicas } = body;

    const [client] = await sql`
      INSERT INTO clients (nombre, apellidos, telefono, direccion, fecha_nacimiento, notas_medicas)
      VALUES (${nombre}, ${apellidos}, ${telefono}, ${direccion}, ${fecha_nacimiento}, ${notas_medicas})
      RETURNING *
    `;

    return Response.json(client);
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = {
  path: "/api/clients"
};
