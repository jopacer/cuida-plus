import { neon } from "@netlify/neon";

const sql = neon();

export default async (req) => {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (req.method === "PUT") {
    const body = await req.json();
    const { valoracion, comentario } = body;

    const [review] = await sql`
      UPDATE reviews
      SET valoracion = ${valoracion}, comentario = ${comentario}
      WHERE id = ${id}
      RETURNING *
    `;

    if (!review) {
      return new Response("Review not found", { status: 404 });
    }

    return Response.json(review);
  }

  if (req.method === "DELETE") {
    await sql`DELETE FROM reviews WHERE id = ${id}`;
    return Response.json({ success: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = {
  path: "/api/reviews/:id"
};
