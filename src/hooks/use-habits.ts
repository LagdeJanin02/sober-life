import * as React from "react";
import { loadHabits, saveHabits, type Habit } from "@/lib/soberlife";

export function useHabits() {
  const [habits, setHabits] = React.useState<Habit[]>([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setHabits(loadHabits());
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
        h.id === id ? { ...h, startDate: new Date().toISOString() } : h,
      );
      update(next);
    },
    [habits, update],
  );

  const removeHabit = React.useCallback(
    (id: string) => {
      update(habits.filter((h) => h.id !== id));
    },
    [habits, update],
  );

  return { habits, ready, addHabit, resetHabit, removeHabit };
}