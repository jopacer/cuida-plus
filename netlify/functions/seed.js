import { neon } from "@netlify/neon";

const sql = neon();

const cuidadores = [
  {
    nombre: "Ana Pérez",
    ubicacion: "Madrid",
    experiencia: 5,
    certificaciones: ["TCAE", "Curso Alzheimer"],
    tarifa: 12.5,
    disponibilidad: "L-V 8:00–18:00",
    descripcion: "Cuidadora con 5 años de experiencia en domicilio. Paciente y responsable.",
    valoracion_promedio: 4.8,
    num_resenas: 20,
    foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800"
  },
  {
    nombre: "Luis Gómez",
    ubicacion: "Majadahonda",
    experiencia: 3,
    certificaciones: ["Aux. Enfermería"],
    tarifa: 11.0,
    disponibilidad: "Fines de semana",
    descripcion: "Acompañamiento y control de medicación. Vehículo propio.",
    valoracion_promedio: 4.5,
    num_resenas: 12,
    foto: "https://images.unsplash.com/photo-1600486913747-55e0876a2b6f?w=800"
  },
  {
    nombre: "María López",
    ubicacion: "Pozuelo",
    experiencia: 7,
    certificaciones: ["TCAE", "Movilización segura"],
    tarifa: 14.0,
    disponibilidad: "Noches",
    descripcion: "Experta en movilización y cuidados postoperatorios.",
    valoracion_promedio: 4.9,
    num_resenas: 34,
    foto: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800"
  }
];

async function seed() {
  try {
    for (const cuidador of cuidadores) {
      await sql`
        INSERT INTO cuidadores (
          nombre, ubicacion, experiencia, certificaciones, tarifa,
          disponibilidad, descripcion, valoracion_promedio, num_resenas, foto
        ) VALUES (
          ${cuidador.nombre},
          ${cuidador.ubicacion},
          ${cuidador.experiencia},
          ${cuidador.certificaciones},
          ${cuidador.tarifa},
          ${cuidador.disponibilidad},
          ${cuidador.descripcion},
          ${cuidador.valoracion_promedio},
          ${cuidador.num_resenas},
          ${cuidador.foto}
        )
        ON CONFLICT DO NOTHING
      `;
    }
    
    const count = await sql`SELECT COUNT(*) FROM cuidadores`;
    
    console.log('✅ Datos insertados exitosamente');
    return { success: true, count: count[0].count };
  } catch (error) {
    console.error('❌ Error al insertar datos:', error);
    throw error;
  }
}

export default async (req, context) => {
  try {
    const result = await seed();
    return Response.json({ 
      ok: true, 
      message: 'Datos insertados exitosamente',
      count: result.count
    });
  } catch (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }
}
