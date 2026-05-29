// Tema oscuro / claro real. Aplica clase light-mode en <html>.

const KEY = "soberlife.theme.v1";
export type Theme = "dark" | "light";

export function getTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem(KEY) as Theme) || "dark";
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "light") root.classList.add("light-mode");
  else root.classList.remove("light-mode");
}

export function setTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, theme);
  applyTheme(theme);
  window.dispatchEvent(new CustomEvent("soberlife:theme", { detail: theme }));
}

export function initTheme() {
  applyTheme(getTheme());
}