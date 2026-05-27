export interface Challenge {
  id: string;
  title: string;
  description: string;
  rewardTheme?: string;
  done: boolean;
}

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: "c1",
    title: "Fin de semana sin pantallas",
    description: "Sábado y domingo sin redes sociales ni streaming.",
    rewardTheme: "Tema Aurora",
    done: false,
  },
  {
    id: "c2",
    title: "7 días seguidos registrando el contador",
    description: "Pulsa 'Aumentar día' siete días consecutivos.",
    done: true,
  },
  {
    id: "c3",
    title: "Asiste a una junta comunitaria",
    description: "Únete a un evento presencial o virtual.",
    done: false,
  },
  {
    id: "c4",
    title: "Lee 3 fichas de la enciclopedia",
    description: "Aprender desarma al hábito.",
    rewardTheme: "Tema Esmeralda",
    done: true,
  },
  {
    id: "c5",
    title: "Agenda una sesión con un profesional",
    description: "Da el paso de pedir ayuda formal.",
    done: false,
  },
];