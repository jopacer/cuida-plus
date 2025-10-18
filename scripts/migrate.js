import { neon } from "@netlify/neon";

const sql = neon(process.env.NETLIFY_DATABASE_URL);

async function migrate() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'client', 'caregiver')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        nombre VARCHAR(255) NOT NULL,
        apellidos VARCHAR(255),
        telefono VARCHAR(20),
        direccion TEXT,
        fecha_nacimiento DATE,
        notas_medicas TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS caregivers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        nombre VARCHAR(255) NOT NULL,
        apellidos VARCHAR(255),
        telefono VARCHAR(20),
        ubicacion VARCHAR(255),
        experiencia INTEGER,
        certificaciones TEXT[],
        tarifa DECIMAL(10,2),
        disponibilidad TEXT,
        descripcion TEXT,
        foto VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS interventions (
        id SERIAL PRIMARY KEY,
        caregiver_id INTEGER NOT NULL REFERENCES caregivers(id) ON DELETE CASCADE,
        client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
        fecha_programada TIMESTAMP NOT NULL,
        fecha_inicio TIMESTAMP,
        fecha_fin TIMESTAMP,
        estado VARCHAR(20) NOT NULL DEFAULT 'programada' CHECK (estado IN ('programada', 'en_curso', 'completada', 'cancelada')),
        notas TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        intervention_id INTEGER UNIQUE NOT NULL REFERENCES interventions(id) ON DELETE CASCADE,
        client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
        caregiver_id INTEGER NOT NULL REFERENCES caregivers(id) ON DELETE CASCADE,
        valoracion INTEGER NOT NULL CHECK (valoracion >= 1 AND valoracion <= 5),
        comentario TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_interventions_caregiver ON interventions(caregiver_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_interventions_client ON interventions(client_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_reviews_caregiver ON reviews(caregiver_id)
    `;

    console.log("✅ Database migration completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
