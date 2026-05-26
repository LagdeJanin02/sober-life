export type HabitType = "fumar" | "alcohol" | "videojuegos" | "vapeo" | "otro";

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
  startDate: string; // ISO date
  reason: string;
}

export const HABIT_PRESETS: { value: HabitType; label: string; emoji: string }[] = [
  { value: "fumar", label: "Sin Fumar", emoji: "🚭" },
  { value: "alcohol", label: "Sin Alcohol", emoji: "🍷" },
  { value: "videojuegos", label: "Sin Videojuegos", emoji: "🎮" },
  { value: "vapeo", label: "Sin Vapeo", emoji: "💨" },
  { value: "otro", label: "Otro hábito", emoji: "✨" },
];

export const MOTIVATIONAL_MESSAGES = [
  "Un día a la vez. Hoy ya estás ganando.",
  "Tu futuro yo te lo agradecerá.",
  "Cada hora limpia es una victoria silenciosa.",
  "La paz vale más que el placer fugaz.",
  "Eres más fuerte de lo que crees.",
  "Respira. Estás reescribiendo tu historia.",
  "El cambio empieza con una decisión, hoy.",
  "Tu mente clara es tu mayor superpoder.",
];

export interface Medal {
  id: string;
  name: string;
  days: number;
  tier: "bronce" | "plata" | "oro" | "platino" | "diamante";
  description: string;
}

export const MEDALS: Medal[] = [
  { id: "m1", name: "Primer Paso", days: 1, tier: "bronce", description: "Un día completo." },
  { id: "m3", name: "Constancia", days: 3, tier: "bronce", description: "Tres días de fuerza." },
  { id: "m7", name: "Semana de Oro", days: 7, tier: "plata", description: "Una semana limpia." },
  { id: "m14", name: "Quincena", days: 14, tier: "plata", description: "Dos semanas firmes." },
  { id: "m30", name: "Mente Clara", days: 30, tier: "oro", description: "Un mes completo." },
  { id: "m90", name: "Renacer", days: 90, tier: "platino", description: "Tres meses." },
  { id: "m180", name: "Maestría", days: 180, tier: "diamante", description: "Medio año." },
];

export function daysSince(iso: string): number {
  const start = new Date(iso).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
}

const STORAGE_KEY = "soberlife.habits.v1";

function seed(): Habit[] {
  const now = new Date();
  const daysAgo = (n: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    return d.toISOString();
  };
  return [
    {
      id: crypto.randomUUID(),
      name: "Sin Fumar",
      type: "fumar",
      startDate: daysAgo(12),
      reason: "Quiero recuperar mi respiración y disfrutar correr de nuevo.",
    },
    {
      id: crypto.randomUUID(),
      name: "Sin Alcohol",
      type: "alcohol",
      startDate: daysAgo(5),
      reason: "Por mi familia y por dormir tranquilo.",
    },
  ];
}

export function loadHabits(): Habit[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw) as Habit[];
  } catch {
    return seed();
  }
}

export function saveHabits(habits: Habit[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

export function tierColor(tier: Medal["tier"]): string {
  switch (tier) {
    case "bronce":
      return "from-amber-700 to-orange-500";
    case "plata":
      return "from-slate-300 to-slate-500";
    case "oro":
      return "from-yellow-300 to-amber-500";
    case "platino":
      return "from-cyan-200 to-violet-400";
    case "diamante":
      return "from-fuchsia-300 via-violet-400 to-sky-400";
  }
}