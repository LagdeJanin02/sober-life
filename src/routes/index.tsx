import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, RotateCcw, Flame } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useHabits } from "@/hooks/use-habits";
import {
  HABIT_PRESETS,
  MOTIVATIONAL_MESSAGES,
  daysSince,
  type Habit,
} from "@/lib/soberlife";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function getEmoji(h: Habit) {
  return HABIT_PRESETS.find((p) => p.value === h.type)?.emoji ?? "✨";
}

function Dashboard() {
  const { habits, ready, resetHabit } = useHabits();
  const [message] = React.useState(
    () => MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)],
  );

  return (
    <div className="px-5 pt-10">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">SoberLife</p>
        <h1 className="mt-1 text-3xl font-semibold">
          Hola, <span className="gradient-text">sigue así</span>
        </h1>
      </header>

      <Card className="glass mb-6 border-0 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl gradient-bg p-2.5 shadow-lg shadow-violet-500/30">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Mensaje del día
            </p>
            <p className="mt-1 text-base font-medium leading-snug">{message}</p>
          </div>
        </div>
      </Card>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Tus contadores
      </h2>

      <div className="space-y-4">
        {ready && habits.length === 0 && (
          <Card className="glass border-0 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Aún no tienes hábitos. Crea tu primera meta desde la pestaña "Nueva".
            </p>
          </Card>
        )}
        {habits.map((h) => (
          <HabitCard key={h.id} habit={h} onReset={() => resetHabit(h.id)} />
        ))}
      </div>
    </div>
  );
}

function HabitCard({ habit, onReset }: { habit: Habit; onReset: () => void }) {
  const days = daysSince(habit.startDate);
  return (
    <Card className="relative overflow-hidden border-0 p-0">
      <div className="absolute inset-0 gradient-bg opacity-20" />
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-500/30 blur-3xl" />
      <div className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" />
      <div className="relative p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getEmoji(habit)}</span>
            <h3 className="text-lg font-semibold">{habit.name}</h3>
          </div>
          <Flame className="h-5 w-5 text-violet-300" />
        </div>

        <div className="my-4 text-center">
          <p className="text-7xl font-bold leading-none gradient-text tabular-nums">{days}</p>
          <p className="mt-2 text-sm uppercase tracking-[0.25em] text-muted-foreground">
            {days === 1 ? "Día limpio" : "Días limpios"}
          </p>
        </div>

        {habit.reason && (
          <p className="mb-4 rounded-lg bg-white/5 p-3 text-xs italic text-muted-foreground">
            "{habit.reason}"
          </p>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full border-white/10 bg-white/5 backdrop-blur hover:bg-white/10"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              ¡Recaí!
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="glass border-white/10">
            <AlertDialogHeader>
              <AlertDialogTitle>Respira, está bien.</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Una recaída no borra tu progreso ni quién eres. Lo importante es que vuelves a
                intentarlo, y eso ya es una victoria. ¿Reiniciamos el contador con compasión?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Aún no</AlertDialogCancel>
              <AlertDialogAction
                className="gradient-bg"
                onClick={() => {
                  onReset();
                  toast.success("Reiniciado con cariño. Hoy es el día uno.");
                }}
              >
                Reiniciar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}
