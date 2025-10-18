import { neon } from "@netlify/neon";

const sql = neon();

async function migrate() {
  try {
    await sql(`
      CREATE TABLE IF NOT EXISTS cuidadores (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        ubicacion VARCHAR(255) NOT NULL,
        experiencia INTEGER NOT NULL,
        certificaciones TEXT[] NOT NULL,
        tarifa DECIMAL(10, 2) NOT NULL,
        disponibilidad TEXT NOT NULL,
        descripcion TEXT,
        valoracion_promedio DECIMAL(2, 1),
        num_resenas INTEGER DEFAULT 0,
        foto TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Tabla cuidadores creada exitosamente');
  } catch (error) {
    console.error('❌ Error al crear tabla:', error);
    throw error;
  }
}

export default async (req, context) => {
  try {
    await migrate();
    return Response.json({ ok: true, message: 'Migración completada' });
  } catch (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }
}
