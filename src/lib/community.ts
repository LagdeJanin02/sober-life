export interface CommunityEvent {
  id: string;
  title: string;
  type: "presencial" | "virtual" | "junte";
  date: string; // ISO
  location: string;
  description: string;
}

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  rating: number;
  fee: string;
  avatar: string; // emoji
}

const inDays = (n: number, h = 19) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(h, 0, 0, 0);
  return d.toISOString();
};

export const COMMUNITY_EVENTS: CommunityEvent[] = [
  {
    id: "e1",
    title: "Círculo de apoyo: superando el alcohol",
    type: "presencial",
    date: inDays(2, 19),
    location: "Centro Comunitario La Esperanza, Sala 3",
    description: "Reunión semanal moderada por facilitador certificado. Cupo limitado.",
  },
  {
    id: "e2",
    title: "Meditación guiada online",
    type: "virtual",
    date: inDays(1, 8),
    location: "Zoom — enlace al inscribirse",
    description: "30 minutos para empezar el día en calma. Abierto a todos los hábitos.",
  },
  {
    id: "e3",
    title: "Junte: caminata al parque",
    type: "junte",
    date: inDays(4, 10),
    location: "Parque del Este, entrada principal",
    description: "Salida grupal al aire libre. Lleva agua y zapatos cómodos.",
  },
  {
    id: "e4",
    title: "Tarde de cine sin alcohol",
    type: "junte",
    date: inDays(6, 17),
    location: "Cinex Sambil, sala VIP",
    description: "Distracción saludable con la comunidad. Reserva tu silla.",
  },
  {
    id: "e5",
    title: "Videojuegos cooperativos (Switch night)",
    type: "junte",
    date: inDays(9, 20),
    location: "Coworking Hub, piso 2",
    description: "Jugar sin caer en el exceso: máximo 2 horas de juego en grupo.",
  },
];

export const PROFESSIONALS: Professional[] = [
  {
    id: "p1",
    name: "Dra. Lucía Mendoza",
    specialty: "Psiquiatra — Adicciones a sustancias",
    bio: "15 años acompañando procesos de desintoxicación con enfoque integrativo.",
    rating: 4.9,
    fee: "USD 60 / sesión",
    avatar: "👩‍⚕️",
  },
  {
    id: "p2",
    name: "Lic. Andrés Rivera",
    specialty: "Psicólogo clínico — Conductas compulsivas",
    bio: "Especialista en TCC para apuestas, videojuegos y compras compulsivas.",
    rating: 4.8,
    fee: "USD 45 / sesión",
    avatar: "👨‍⚕️",
  },
  {
    id: "p3",
    name: "Dra. Camila Soto",
    specialty: "Psicóloga — Conductas digitales y ansiedad",
    bio: "Trabaja con jóvenes y adultos en uso problemático de redes y pantallas.",
    rating: 5.0,
    fee: "USD 50 / sesión",
    avatar: "🧑‍⚕️",
  },
];