import * as React from "react";
import { profileKey } from "@/lib/auth";
import { INITIAL_CHALLENGES, type Challenge } from "@/lib/challenges";

const EVENT = "soberlife:challenges";

function load(): Challenge[] {
  if (typeof window === "undefined") return INITIAL_CHALLENGES;
  try {
    const raw = localStorage.getItem(profileKey("challenges"));
    return raw ? (JSON.parse(raw) as Challenge[]) : INITIAL_CHALLENGES;
  } catch {
    return INITIAL_CHALLENGES;
  }
}

function save(list: Challenge[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(profileKey("challenges"), JSON.stringify(list));
  window.dispatchEvent(new Event(EVENT));
}

export function useChallenges() {
  const [items, setItems] = React.useState<Challenge[]>(INITIAL_CHALLENGES);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const refresh = () => setItems(load());
    refresh();
    setReady(true);
    window.addEventListener(EVENT, refresh);
    window.addEventListener("soberlife:profile-change", refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("soberlife:profile-change", refresh);
    };
  }, []);

  /**
   * Alterna el estado de un reto y persiste. Devuelve el reto resultante
   * (útil para mostrar feedback de recompensa cuando se completa).
   */
  const toggle = React.useCallback((id: string): Challenge | null => {
    const list = load();
    let result: Challenge | null = null;
    const next = list.map((c) => {
      if (c.id !== id) return c;
      result = { ...c, done: !c.done };
      return result;
    });
    save(next);
    return result;
  }, []);

  return { items, ready, toggle };
}
