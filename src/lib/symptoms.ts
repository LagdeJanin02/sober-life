import { ADDICTIONS, type Addiction } from "./addictions";

/** Mapa síntoma → ids de adicciones más probables. */
export const SYMPTOM_MAP: Record<string, string[]> = {
  ansiedad: ["alcohol", "tabaco", "vapeo", "azucar", "redes", "tiktok", "compras", "preocupacion"],
  insomnio: ["cafeina", "energizantes", "videojuegos", "netflix", "celular", "tiktok", "cocaina"],
  compulsion: ["pornografia", "apuestas", "compras", "comida", "redes", "tricotilomania"],
  irritabilidad: ["tabaco", "vapeo", "cafeina", "ira", "videojuegos"],
  tristeza: ["alcohol", "comida", "chocolate", "victimismo", "autocompasion"],
  soledad: ["pornografia", "citas_apps", "redes", "alcohol", "comida_rapida"],
  aburrimiento: ["videojuegos", "tiktok", "youtube", "redes", "comida", "memes"],
  estres: ["alcohol", "tabaco", "comida", "azucar", "trabajo", "ejercicio"],
  euforia: ["cocaina", "extasis", "apuestas", "cripto_trading", "riesgo"],
  vacio: ["pornografia", "compras", "ecommerce", "comida", "drama"],
  rabia: ["ira", "alcohol", "videojuegos", "conducir"],
  miedo: ["preocupacion", "celos", "fomo", "control"],
  baja_autoestima: ["selfies", "comparacion", "aprobacion", "cirugias", "comida"],
  procastinar: ["tiktok", "youtube", "videojuegos", "procrastinacion", "memes"],
};

const SYNONYMS: Record<string, string> = {
  estrés: "estres",
  depresión: "tristeza",
  depresion: "tristeza",
  pena: "tristeza",
  enojo: "rabia",
  ira: "rabia",
  pánico: "miedo",
  panico: "miedo",
  vacío: "vacio",
  procrastinar: "procastinar",
  procrastinación: "procastinar",
  procrastinacion: "procastinar",
  autoestima: "baja_autoestima",
  "auto-estima": "baja_autoestima",
};

export function searchBySymptom(query: string): Addiction[] {
  const term = query.trim().toLowerCase();
  if (!term) return [];
  const key = SYNONYMS[term] ?? term;
  const ids = SYMPTOM_MAP[key];
  if (!ids) {
    // partial match across all keys
    const match = Object.keys(SYMPTOM_MAP).find((k) => k.includes(key) || key.includes(k));
    if (!match) return [];
    return ADDICTIONS.filter((a) => SYMPTOM_MAP[match].includes(a.id));
  }
  return ADDICTIONS.filter((a) => ids.includes(a.id));
}

export const COMMON_SYMPTOMS = [
  "ansiedad",
  "insomnio",
  "compulsión",
  "tristeza",
  "soledad",
  "aburrimiento",
  "estrés",
  "rabia",
  "vacío",
  "baja autoestima",
];