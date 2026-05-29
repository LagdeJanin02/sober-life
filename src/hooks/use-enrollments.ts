import * as React from "react";
import { profileKey } from "@/lib/auth";

export interface Enrollment {
  id: string;
  eventId: string;
  title: string;
  date: string; // ISO
  location: string;
  modality: string;
  createdAt: string;
}

function load(): Enrollment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(profileKey("enrollments"));
    return raw ? (JSON.parse(raw) as Enrollment[]) : [];
  } catch {
    return [];
  }
}

function save(list: Enrollment[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(profileKey("enrollments"), JSON.stringify(list));
  window.dispatchEvent(new Event("soberlife:enrollments"));
}

export function useEnrollments() {
  const [items, setItems] = React.useState<Enrollment[]>([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const refresh = () => setItems(load());
    refresh();
    setReady(true);
    window.addEventListener("soberlife:enrollments", refresh);
    window.addEventListener("soberlife:profile-change", refresh);
    return () => {
      window.removeEventListener("soberlife:enrollments", refresh);
      window.removeEventListener("soberlife:profile-change", refresh);
    };
  }, []);

  const enroll = React.useCallback(
    (e: Omit<Enrollment, "id" | "createdAt">) => {
      const list = load();
      if (list.some((x) => x.eventId === e.eventId)) return null;
      const next: Enrollment = {
        ...e,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      save([...list, next]);
      return next;
    },
    [],
  );

  const cancel = React.useCallback((id: string) => {
    save(load().filter((e) => e.id !== id));
  }, []);

  const isEnrolled = React.useCallback(
    (eventId: string) => items.some((e) => e.eventId === eventId),
    [items],
  );

  return { items, ready, enroll, cancel, isEnrolled };
}