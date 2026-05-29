// Stack de navegación global persistente.
// Permite "Regresar" a la pantalla anterior real, no a una ruta fija.

const KEY = "soberlife.navhistory.v1";
const MAX = 30;

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(stack: string[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(stack.slice(-MAX)));
  } catch {
    /* ignore */
  }
}

/** Añade una ruta al stack. Ignora duplicados consecutivos. */
export function pushToHistory(path: string) {
  const stack = read();
  if (stack[stack.length - 1] === path) return;
  stack.push(path);
  write(stack);
}

/**
 * Saca la ruta actual y devuelve la anterior.
 * Devuelve null si no hay pantalla previa.
 */
export function popFromHistory(): string | null {
  const stack = read();
  if (stack.length < 2) return null;
  stack.pop(); // ruta actual
  const prev = stack[stack.length - 1] ?? null;
  write(stack);
  return prev;
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}

export function peekHistory(): string[] {
  return read();
}