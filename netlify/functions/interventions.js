import { neon } from "@netlify/neon";

const sql = neon();

export default async (req) => {
  if (req.method === "GET") {
    const url = new URL(req.url);
    const clientId = url.searchParams.get("client_id");
    const caregiverId = url.searchParams.get("caregiver_id");

    let query;
    if (clientId) {
      query = await sql`
        SELECT i.*, c.nombre as caregiver_nombre, cl.nombre as client_nombre
        FROM interventions i
        JOIN caregivers c ON i.caregiver_id = c.id
        JOIN clients cl ON i.client_id = cl.id
        WHERE i.client_id = ${clientId}
        ORDER BY i.fecha_programada DESC
      `;
    } else if (caregiverId) {
      query = await sql`
        SELECT i.*, c.nombre as caregiver_nombre, cl.nombre as client_nombre
        FROM interventions i
        JOIN caregivers c ON i.caregiver_id = c.id
        JOIN clients cl ON i.client_id = cl.id
        WHERE i.caregiver_id = ${caregiverId}
        ORDER BY i.fecha_programada DESC
      `;
    } else {
      query = await sql`
        SELECT i.*, c.nombre as caregiver_nombre, cl.nombre as client_nombre
        FROM interventions i
        JOIN caregivers c ON i.caregiver_id = c.id
        JOIN clients cl ON i.client_id = cl.id
        ORDER BY i.fecha_programada DESC
      `;
    }

    return Response.json(query);
  }

  if (req.method === "POST") {
    const body = await req.json();
    const { caregiver_id, client_id, fecha_programada, notas } = body;

    const [intervention] = await sql`
      INSERT INTO interventions (caregiver_id, client_id, fecha_programada, notas)
      VALUES (${caregiver_id}, ${client_id}, ${fecha_programada}, ${notas})
      RETURNING *
    `;

    return Response.json(intervention);
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = {
  path: "/api/interventions"
};
