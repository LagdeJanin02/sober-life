import * as React from "react";
import { profileKey } from "@/lib/auth";

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorAvatar: string;
  modality: "Individual" | "Grupal";
  space: "Consultorio clínico" | "Aire libre";
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  payment: string;
  currency: string;
  priceLabel: string;
  status: "Confirmada" | "Pendiente";
  createdAt: string;
}

function load(): Appointment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(profileKey("appointments"));
    return raw ? (JSON.parse(raw) as Appointment[]) : [];
  } catch {
    return [];
  }
}

function save(list: Appointment[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(profileKey("appointments"), JSON.stringify(list));
  window.dispatchEvent(new Event("soberlife:appointments"));
}

export function useAppointments() {
  const [items, setItems] = React.useState<Appointment[]>([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const refresh = () => setItems(load());
    refresh();
    setReady(true);
    window.addEventListener("soberlife:appointments", refresh);
    window.addEventListener("soberlife:profile-change", refresh);
    return () => {
      window.removeEventListener("soberlife:appointments", refresh);
      window.removeEventListener("soberlife:profile-change", refresh);
    };
  }, []);

  const add = React.useCallback((a: Omit<Appointment, "id" | "createdAt">) => {
    const next: Appointment = {
      ...a,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    save([...load(), next]);
    return next;
  }, []);

  const cancel = React.useCallback((id: string) => {
    save(load().filter((a) => a.id !== id));
  }, []);

  return { items, ready, add, cancel };
}