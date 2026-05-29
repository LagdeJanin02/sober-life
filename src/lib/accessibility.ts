// Módulo de Accesibilidad Universal — efectos inmediatos.

const KEY = "soberlife.a11y.v1";

export interface A11ySettings {
  highContrast: boolean;
  screenReader: boolean;
  rampFilter: boolean;
}

const DEFAULT: A11ySettings = {
  highContrast: false,
  screenReader: false,
  rampFilter: false,
};

export function getA11y(): A11ySettings {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

export function setA11y(next: Partial<A11ySettings>) {
  if (typeof window === "undefined") return;
  const merged = { ...getA11y(), ...next };
  localStorage.setItem(KEY, JSON.stringify(merged));
  applyA11y(merged);
  window.dispatchEvent(new CustomEvent("soberlife:a11y", { detail: merged }));
}

let listenerAttached = false;

function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = navigator.language?.startsWith("es") ? "es-ES" : "en-US";
  msg.rate = 1;
  synth.speak(msg);
}

function handleFocus(e: Event) {
  const t = e.target as HTMLElement | null;
  if (!t) return;
  const label =
    t.getAttribute("aria-label") ||
    t.getAttribute("alt") ||
    (t.textContent ?? "").trim().slice(0, 140);
  if (label) speak(label);
}

export function applyA11y(s: A11ySettings = getA11y()) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("high-contrast", s.highContrast);
  root.classList.toggle("screen-reader-on", s.screenReader);
  root.classList.toggle("ramp-filter", s.rampFilter);

  if (s.screenReader && !listenerAttached) {
    document.addEventListener("focusin", handleFocus, true);
    document.addEventListener("click", handleFocus, true);
    listenerAttached = true;
  } else if (!s.screenReader && listenerAttached) {
    document.removeEventListener("focusin", handleFocus, true);
    document.removeEventListener("click", handleFocus, true);
    listenerAttached = false;
    window.speechSynthesis?.cancel();
  }
}

export function initA11y() {
  applyA11y();
}