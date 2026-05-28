const KEY = "soberlife.session.v1";
const CODE_KEY = "soberlife.usercode.v1";

export interface Session {
  email: string;
  name: string;
  avatar?: string; // emoji
  code: string; // friend code
}

function randomCode() {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "SL-";
  for (let i = 0; i < 6; i++) s += c[Math.floor(Math.random() * c.length)];
  return s;
}

export function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function saveSession(s: Session) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
  localStorage.setItem(CODE_KEY, s.code);
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function ensureCode(): string {
  if (typeof window === "undefined") return "SL-XXXXXX";
  let c = localStorage.getItem(CODE_KEY);
  if (!c) {
    c = randomCode();
    localStorage.setItem(CODE_KEY, c);
  }
  return c;
}

export function createSession(email: string, name: string): Session {
  const s: Session = { email, name, code: randomCode(), avatar: "💜" };
  saveSession(s);
  return s;
}

export const PUBLIC_ROUTES = new Set(["/welcome", "/login", "/elige-adiccion"]);