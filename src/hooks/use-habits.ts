import * as React from "react";
import {
  loadHabits,
  saveHabits,
  reconcileHabit,
  todayKey,
  diffDaysKey,
  type Habit,
} from "@/lib/soberlife";

export function useHabits() {
  const [habits, setHabits] = React.useState<Habit[]>([]);
  const [ready, setReady] = React.useState(false);
  const [removalLog, setRemovalLog] = React.useState<
    { id: string; name: string; reason: string; date: string }[]
  >([]);

  React.useEffect(() => {
    const reconciled = loadHabits().map(reconcileHabit);
    setHabits(reconciled);
    saveHabits(reconciled);
    setReady(true);
  }, []);

  const update = React.useCallback((next: Habit[]) => {
    setHabits(next);
    saveHabits(next);
  }, []);

  const addHabit = React.useCallback(
    (h: Omit<Habit, "id">) => {
      const next = [...habits, { ...h, id: crypto.randomUUID() }];
      update(next);
    },
    [habits, update],
  );

  const resetHabit = React.useCallback(
    (id: string) => {
      const next = habits.map((h) =>
        h.id === id
          ? {
              ...h,
              startDate: new Date().toISOString(),
              currentDays: 0,
              lastIncrementDate: null,
            }
          : h,
      );
      update(next);
    },
    [habits, update],
  );

  const incrementDay = React.useCallback(
    (id: string) => {
      const tk = todayKey();
      const next = habits.map((h) => {
        if (h.id !== id) return h;
        if (h.lastIncrementDate === tk) return h; // already today
        const gap = h.lastIncrementDate ? diffDaysKey(tk, h.lastIncrementDate) : 1;
        const newDays = gap === 1 ? h.currentDays + 1 : 1;
        return {
          ...h,
          currentDays: newDays,
          lastIncrementDate: tk,
          bestStreak: Math.max(h.bestStreak, newDays),
        };
      });
      update(next);
    },
    [habits, update],
  );

  const removeHabit = React.useCallback(
    (id: string, reason: string = "Sin motivo") => {
      const h = habits.find((x) => x.id === id);
      if (h) {
        setRemovalLog((p) => [
          ...p,
          { id, name: h.name, reason, date: new Date().toISOString() },
        ]);
      }
      update(habits.filter((h) => h.id !== id));
    },
    [habits, update],
  );

  return { habits, ready, addHabit, resetHabit, removeHabit, incrementDay, removalLog };
}