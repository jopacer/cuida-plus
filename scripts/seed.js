import { neon } from "@netlify/neon";

const sql = neon(process.env.NETLIFY_DATABASE_URL);

async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    const existingCaregivers = await sql`SELECT COUNT(*) FROM caregivers`;
    if (Number(existingCaregivers[0].count) > 0) {
      console.log("⚠️  Database already has data. Skipping seed.");
      return;
    }

    const caregivers = [
      {
        nombre: "Ana",
        apellidos: "Pérez",
        telefono: "+34600123456",
        ubicacion: "Madrid",
        experiencia: 5,
        certificaciones: ["TCAE", "Curso Alzheimer"],
        tarifa: 12.5,
        disponibilidad: "L-V 8:00–18:00",
        descripcion: "Cuidadora con 5 años de experiencia en domicilio. Paciente y responsable.",
        foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800"
      },
      {
        nombre: "Luis",
        apellidos: "Gómez",
        telefono: "+34600234567",
        ubicacion: "Majadahonda",
        experiencia: 3,
        certificaciones: ["Aux. Enfermería"],
        tarifa: 11.0,
        disponibilidad: "Fines de semana",
        descripcion: "Acompañamiento y control de medicación. Vehículo propio.",
        foto: "https://images.unsplash.com/photo-1600486913747-55e0876a2b6f?w=800"
      },
      {
        nombre: "María",
        apellidos: "López",
        telefono: "+34600345678",
        ubicacion: "Pozuelo",
        experiencia: 7,
        certificaciones: ["TCAE", "Movilización segura"],
        tarifa: 14.0,
        disponibilidad: "Noches",
        descripcion: "Experta en movilización y cuidados postoperatorios.",
        foto: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800"
      }
    ];

    for (const caregiver of caregivers) {
      await sql`
        INSERT INTO caregivers (nombre, apellidos, telefono, ubicacion, experiencia, certificaciones, tarifa, disponibilidad, descripcion, foto)
        VALUES (${caregiver.nombre}, ${caregiver.apellidos}, ${caregiver.telefono}, ${caregiver.ubicacion}, ${caregiver.experiencia}, ${caregiver.certificaciones}, ${caregiver.tarifa}, ${caregiver.disponibilidad}, ${caregiver.descripcion}, ${caregiver.foto})
      `;
      console.log(`✅ Added caregiver: ${caregiver.nombre} ${caregiver.apellidos}`);
    }

    const clients = [
      { nombre: "Carlos", apellidos: "García", telefono: "+34611111111", direccion: "C/ Mayor 1, Madrid" },
      { nombre: "Laura", apellidos: "Martínez", telefono: "+34622222222", direccion: "C/ Sol 2, Madrid" },
      { nombre: "Pedro", apellidos: "Sánchez", telefono: "+34633333333", direccion: "Av. Principal 10, Pozuelo" }
    ];

    for (const client of clients) {
      await sql`
        INSERT INTO clients (nombre, apellidos, telefono, direccion)
        VALUES (${client.nombre}, ${client.apellidos}, ${client.telefono}, ${client.direccion})
      `;
      console.log(`✅ Added client: ${client.nombre} ${client.apellidos}`);
    }

    const [ana, luis, maria] = await sql`SELECT id, nombre FROM caregivers ORDER BY id`;
    const [carlos, laura, pedro] = await sql`SELECT id, nombre FROM clients ORDER BY id`;

    const interventions = [
      {
        caregiver_id: ana.id,
        client_id: carlos.id,
        fecha_programada: new Date('2025-01-15 10:00:00'),
        estado: 'completada',
        fecha_inicio: new Date('2025-01-15 10:00:00'),
        fecha_fin: new Date('2025-01-15 14:00:00')
      },
      {
        caregiver_id: ana.id,
        client_id: laura.id,
        fecha_programada: new Date('2025-02-10 09:00:00'),
        estado: 'completada',
        fecha_inicio: new Date('2025-02-10 09:00:00'),
        fecha_fin: new Date('2025-02-10 13:00:00')
      },
      {
        caregiver_id: luis.id,
        client_id: pedro.id,
        fecha_programada: new Date('2025-03-05 15:00:00'),
        estado: 'completada',
        fecha_inicio: new Date('2025-03-05 15:00:00'),
        fecha_fin: new Date('2025-03-05 19:00:00')
      },
      {
        caregiver_id: maria.id,
        client_id: carlos.id,
        fecha_programada: new Date('2025-04-20 20:00:00'),
        estado: 'completada',
        fecha_inicio: new Date('2025-04-20 20:00:00'),
        fecha_fin: new Date('2025-04-21 08:00:00')
      },
      {
        caregiver_id: maria.id,
        client_id: laura.id,
        fecha_programada: new Date('2025-11-15 10:00:00'),
        estado: 'programada'
      }
    ];

    for (const intervention of interventions) {
      await sql`
        INSERT INTO interventions (caregiver_id, client_id, fecha_programada, estado, fecha_inicio, fecha_fin)
        VALUES (${intervention.caregiver_id}, ${intervention.client_id}, ${intervention.fecha_programada}, ${intervention.estado}, ${intervention.fecha_inicio || null}, ${intervention.fecha_fin || null})
      `;
    }
    console.log(`✅ Added ${interventions.length} interventions`);

    const completedInterventions = await sql`
      SELECT id, caregiver_id, client_id FROM interventions WHERE estado = 'completada'
    `;

    const reviews = [
      { intervention_id: completedInterventions[0].id, caregiver_id: completedInterventions[0].caregiver_id, client_id: completedInterventions[0].client_id, valoracion: 5, comentario: "Excelente trato, muy profesional y atenta." },
      { intervention_id: completedInterventions[1].id, caregiver_id: completedInterventions[1].caregiver_id, client_id: completedInterventions[1].client_id, valoracion: 5, comentario: "Muy recomendable, mi padre se sintió muy cómodo." },
      { intervention_id: completedInterventions[2].id, caregiver_id: completedInterventions[2].caregiver_id, client_id: completedInterventions[2].client_id, valoracion: 4, comentario: "Buen servicio, puntual y responsable." },
      { intervention_id: completedInterventions[3].id, caregiver_id: completedInterventions[3].caregiver_id, client_id: completedInterventions[3].client_id, valoracion: 5, comentario: "Excelente en cuidados nocturnos. Muy profesional." }
    ];

    for (const review of reviews) {
      await sql`
        INSERT INTO reviews (intervention_id, caregiver_id, client_id, valoracion, comentario)
        VALUES (${review.intervention_id}, ${review.caregiver_id}, ${review.client_id}, ${review.valoracion}, ${review.comentario})
      `;
    }
    console.log(`✅ Added ${reviews.length} reviews`);

    console.log("🎉 Database seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
