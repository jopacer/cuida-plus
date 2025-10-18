import { neon } from "@netlify/neon";

const sql = neon();

export default async (req) => {
  if (req.method === "GET") {
    const url = new URL(req.url);
    const caregiverId = url.searchParams.get("caregiver_id");

    if (caregiverId) {
      const reviews = await sql`
        SELECT r.*, cl.nombre as client_nombre
        FROM reviews r
        JOIN clients cl ON r.client_id = cl.id
        WHERE r.caregiver_id = ${caregiverId}
        ORDER BY r.created_at DESC
      `;
      return Response.json(reviews);
    }

    const reviews = await sql`
      SELECT r.*, c.nombre as caregiver_nombre, cl.nombre as client_nombre
      FROM reviews r
      JOIN caregivers c ON r.caregiver_id = c.id
      JOIN clients cl ON r.client_id = cl.id
      ORDER BY r.created_at DESC
    `;
    return Response.json(reviews);
  }

  if (req.method === "POST") {
    const body = await req.json();
    const { intervention_id, client_id, caregiver_id, valoracion, comentario } = body;

    const [existing] = await sql`
      SELECT id FROM reviews WHERE intervention_id = ${intervention_id}
    `;

    if (existing) {
      return new Response("Review already exists for this intervention", { status: 400 });
    }

    const [review] = await sql`
      INSERT INTO reviews (intervention_id, client_id, caregiver_id, valoracion, comentario)
      VALUES (${intervention_id}, ${client_id}, ${caregiver_id}, ${valoracion}, ${comentario})
      RETURNING *
    `;

    return Response.json(review);
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = {
  path: "/api/reviews"
};
