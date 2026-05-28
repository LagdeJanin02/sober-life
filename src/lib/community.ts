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
  treats: string[]; // addiction ids
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

const AV = ["👩‍⚕️", "👨‍⚕️", "🧑‍⚕️"];
const FN = ["Lucía", "Andrés", "Camila", "Roberto", "María", "Jorge", "Patricia", "Diego", "Elena", "Carlos", "Sofía", "Luis", "Ana", "Pedro", "Beatriz", "Manuel", "Daniela", "Rafael", "Isabel", "José"];
const LN = ["Mendoza", "Rivera", "Soto", "Pérez", "Gómez", "Martínez", "Jiménez", "Castro", "Vargas", "Reyes", "Núñez", "Santana", "Peña", "Cruz", "Méndez", "Báez", "Polanco", "Rosario", "Encarnación", "Almonte"];
const SPECS = [
  { title: "Psiquiatra — Adicciones a sustancias", treats: ["alcohol", "cocaina", "heroina", "tabaco", "vapeo"] },
  { title: "Psicólogo/a clínico/a — Conductas compulsivas", treats: ["apuestas", "videojuegos", "compras", "trabajo", "sexo"] },
  { title: "Psicólogo/a — Adicciones digitales", treats: ["redes", "tiktok", "pornografia", "videojuegos", "celular"] },
  { title: "Psiquiatra — Trastornos duales", treats: ["alcohol", "cannabis", "benzodiacepinas", "opioides_rx"] },
  { title: "Psicólogo/a — Conductas alimentarias", treats: ["azucar", "comida", "bulimia", "anorexia", "ortorexia"] },
  { title: "Psicólogo/a familiar — Codependencia", treats: ["relaciones", "celos", "aprobacion", "drama"] },
];
const BIOS = [
  "Más de 10 años acompañando procesos de recuperación con enfoque integrativo.",
  "Especialista en terapia cognitivo-conductual (TCC) basada en evidencia.",
  "Trabajo con jóvenes y adultos. Modalidad presencial y telemedicina.",
  "Enfoque humanista, sin juicios. Adapto el tratamiento a tu ritmo.",
  "Formación internacional en mindfulness aplicado a adicciones.",
  "Experto/a en prevención de recaídas y manejo del craving.",
];

export const PROFESSIONALS: Professional[] = Array.from({ length: 50 }, (_, i) => {
  const spec = SPECS[i % SPECS.length];
  const fn = FN[i % FN.length];
  const ln = LN[(i * 3) % LN.length];
  const title = i % 4 === 0 ? "Dr." : i % 4 === 1 ? "Dra." : i % 4 === 2 ? "Lic." : "Lic.";
  const fee = 30 + (i % 7) * 10;
  return {
    id: `p${i + 1}`,
    name: `${title} ${fn} ${ln}`,
    specialty: spec.title,
    bio: BIOS[i % BIOS.length],
    rating: Math.round((4.3 + (i % 7) * 0.1) * 10) / 10,
    fee: `USD ${fee} / RD$ ${fee * 60} por sesión`,
    avatar: AV[i % AV.length],
    treats: spec.treats.slice(0, 1 + (i % 5)),
  };
});