export type HabitType = "fumar" | "alcohol" | "videojuegos" | "vapeo" | "otro";

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
  startDate: string; // ISO date (when streak started)
  reason: string;
  /** Días limpios contados manualmente (botón Aumentar día). */
  currentDays: number;
  /** YYYY-MM-DD del último incremento manual. null = nunca. */
  lastIncrementDate: string | null;
  /** Mejor racha histórica. */
  bestStreak: number;
  /** ID de adicción del catálogo (opcional). */
  addictionId?: string;
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

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function diffDaysKey(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((da - db) / (1000 * 60 * 60 * 24));
}

/** Devuelve hábito normalizado: si pasó más de 1 día sin incrementar, racha = 0. */
export function reconcileHabit(h: Habit): Habit {
  if (!h.lastIncrementDate) return h;
  const gap = diffDaysKey(todayKey(), h.lastIncrementDate);
  if (gap > 1) {
    return { ...h, currentDays: 0, lastIncrementDate: null, startDate: new Date().toISOString() };
  }
  return h;
}

/** Minutos restantes hasta la próxima medianoche. */
export function minutesToMidnight(now: Date = new Date()): number {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return Math.max(0, Math.floor((next.getTime() - now.getTime()) / 60000));
}

import { profileKey } from "./auth";

/** Estado inicial vacío: la app arranca SIN datos hasta que el usuario los cree. */
export function loadHabits(): Habit[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(profileKey("habits"));
    return raw ? (JSON.parse(raw) as Habit[]) : [];
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(profileKey("habits"), JSON.stringify(habits));
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