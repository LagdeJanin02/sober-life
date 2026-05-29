// Multi-perfil con persistencia en localStorage.
// Conserva las APIs antiguas (Session, loadSession, ensureCode, PUBLIC_ROUTES)
// para no romper el resto del código.

const PROFILES_KEY = "soberlife.profiles.v2";
const ACTIVE_KEY = "soberlife.activeProfile.v2";

export interface Profile {
  id: string;
  email: string;
  name: string;
  avatar: string; // emoji
  code: string; // friend code
  createdAt: string;
}

/** Alias para compat con código viejo. */
export type Session = Profile;

function randomCode() {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "SL-";
  for (let i = 0; i < 6; i++) s += c[Math.floor(Math.random() * c.length)];
  return s;
}

function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "p_" + Math.random().toString(36).slice(2, 10);
}

export function listProfiles(): Profile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    return raw ? (JSON.parse(raw) as Profile[]) : [];
  } catch {
    return [];
  }
}

function saveProfiles(list: Profile[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILES_KEY, JSON.stringify(list));
}

export function getActiveProfileId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_KEY);
}

export function setActiveProfile(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) localStorage.setItem(ACTIVE_KEY, id);
  else localStorage.removeItem(ACTIVE_KEY);
  window.dispatchEvent(new CustomEvent("soberlife:profile-change", { detail: id }));
}

export function getActiveProfile(): Profile | null {
  const id = getActiveProfileId();
  if (!id) return null;
  return listProfiles().find((p) => p.id === id) ?? null;
}

/** Crea un perfil nuevo y lo deja activo. */
export function createSession(email: string, name: string): Profile {
  const p: Profile = {
    id: uid(),
    email,
    name: name || email.split("@")[0],
    avatar: "💜",
    code: randomCode(),
    createdAt: new Date().toISOString(),
  };
  const list = listProfiles();
  list.push(p);
  saveProfiles(list);
  setActiveProfile(p.id);
  return p;
}

/** Actualiza el perfil activo (nombre, avatar). */
export function saveSession(s: Profile) {
  const list = listProfiles().map((p) => (p.id === s.id ? s : p));
  saveProfiles(list);
  setActiveProfile(s.id);
}

/** Cierra la sesión actual (no borra los demás perfiles). */
export function clearSession() {
  setActiveProfile(null);
}

/** Borra un perfil del listado. */
export function removeProfile(id: string) {
  const list = listProfiles().filter((p) => p.id !== id);
  saveProfiles(list);
  if (getActiveProfileId() === id) {
    setActiveProfile(list[0]?.id ?? null);
  }
  // Limpia data por-perfil
  if (typeof window !== "undefined") {
    const prefix = `sl:${id}:`;
    Object.keys(localStorage)
      .filter((k) => k.startsWith(prefix))
      .forEach((k) => localStorage.removeItem(k));
  }
}

/** Compat: el resto del código llama loadSession() para saber si hay sesión. */
export function loadSession(): Profile | null {
  return getActiveProfile();
}

/** Compat: devuelve el código del perfil activo (o uno temporal). */
export function ensureCode(): string {
  const p = getActiveProfile();
  return p?.code ?? "SL-------";
}

/** Helpers para guardar datos por-perfil. */
export function profileKey(suffix: string): string {
  const id = getActiveProfileId() ?? "anon";
  return `sl:${id}:${suffix}`;
}

export const PUBLIC_ROUTES = new Set(["/welcome", "/login", "/elige-adiccion"]);