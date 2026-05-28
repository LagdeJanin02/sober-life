import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles, RotateCcw, Flame, Plus, AlertTriangle,
  MapPin, Siren, Trash2,
} from "lucide-react";
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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useHabits } from "@/hooks/use-habits";
import {
  HABIT_PRESETS,
  MOTIVATIONAL_MESSAGES,
  minutesToMidnight,
  todayKey,
  type Habit,
} from "@/lib/soberlife";
import { getAddiction } from "@/lib/addictions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function getEmoji(h: Habit) {
  if (h.addictionId) {
    const a = getAddiction(h.addictionId);
    if (a) return a.emoji;
  }
  return HABIT_PRESETS.find((p) => p.value === h.type)?.emoji ?? "✨";
}

function Dashboard() {
  const { habits, ready, resetHabit, incrementDay, removeHabit } = useHabits();
  const [message, setMessage] = React.useState(MOTIVATIONAL_MESSAGES[0]);
  React.useEffect(() => {
    setMessage(
      MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)],
    );
  }, []);

  const [minsLeft, setMinsLeft] = React.useState<number | null>(null);
  React.useEffect(() => {
    const tick = () => setMinsLeft(minutesToMidnight());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const tk = todayKey();
  const pending = ready && habits.filter((h) => h.lastIncrementDate !== tk);
  const urgent = minsLeft !== null && minsLeft <= 120 && pending && pending.length > 0;
  const blink = minsLeft !== null && minsLeft <= 60 && pending && pending.length > 0;

  return (
    <div className="px-5 pt-10">
      {/* Top action row */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <Button asChild variant="outline" size="sm" className="h-9 border-white/10 bg-white/5">
          <Link to="/centros">
            <MapPin className="mr-1 h-4 w-4" /> Centros RD
          </Link>
        </Button>
        <Button asChild size="sm" className="h-9 bg-red-500/90 hover:bg-red-500 text-white animate-pulse">
          <Link to="/casi-caigo">
            <Siren className="mr-1 h-4 w-4" /> Casi caigo
          </Link>
        </Button>
      </div>

      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">SoberLife</p>
        <h1 className="mt-1 text-3xl font-semibold">
          Hola, <span className="gradient-text">sigue así</span>
        </h1>
      </header>

      {urgent && (
        <Card
          className={cn(
            "mb-4 border border-red-500/40 bg-red-500/10 p-4",
            blink && "animate-pulse",
          )}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-red-300" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-200">
                Faltan {Math.floor(minsLeft! / 60)}h {minsLeft! % 60}m para medianoche
              </p>
              <p className="text-xs text-red-200/80">
                Registra tu día antes de las 12:00 AM o la racha vuelve a 0.
              </p>
            </div>
          </div>
        </Card>
      )}

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
              Aún no tienes hábitos. Crea tu primera meta desde "Más → Nueva meta".
            </p>
          </Card>
        )}
        {habits.map((h) => (
          <HabitCard
            key={h.id}
            habit={h}
            onReset={() => resetHabit(h.id)}
            onRemove={(reason) => {
              removeHabit(h.id, reason);
              toast.success(`"${h.name}" eliminado · ${reason}`);
            }}
            onIncrement={() => {
              if (h.lastIncrementDate === tk) {
                toast.info("Ya registraste hoy. Nos vemos mañana 💜");
                return;
              }
              incrementDay(h.id);
              toast.success("¡+1 día limpio! 🔥");
            }}
          />
        ))}
      </div>
    </div>
  );
}

function HabitCard({
  habit,
  onReset,
  onRemove,
  onIncrement,
}: {
  habit: Habit;
  onReset: () => void;
  onRemove: (reason: string) => void;
  onIncrement: () => void;
}) {
  const days = habit.currentDays;
  const doneToday = habit.lastIncrementDate === todayKey();
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
          <div className="flex items-center gap-1">
            <Flame className="h-5 w-5 text-violet-300" />
            <RemoveHabitDialog onRemove={onRemove} name={habit.name} />
          </div>
        </div>

        <div className="my-4 text-center">
          <p className="text-7xl font-bold leading-none gradient-text tabular-nums">{days}</p>
          <p className="mt-2 text-sm uppercase tracking-[0.25em] text-muted-foreground">
            {days === 1 ? "Día limpio" : "Días limpios"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Mejor racha: <span className="text-foreground">{habit.bestStreak}</span>
          </p>
        </div>

        {habit.reason && (
          <p className="mb-4 rounded-lg bg-white/5 p-3 text-xs italic text-muted-foreground">
            "{habit.reason}"
          </p>
        )}

        <Button
          onClick={onIncrement}
          disabled={doneToday}
          className={cn(
            "mb-2 h-12 w-full text-base font-semibold",
            doneToday
              ? "bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/20"
              : "gradient-bg shadow-lg shadow-violet-500/30",
          )}
        >
          <Plus className="mr-2 h-5 w-5" />
          {doneToday ? "Día registrado ✓" : "Aumentar día"}
        </Button>

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
              <AlertDialogTitle>Espera un momento...</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                ¿De verdad recaíste, o todavía puedes resistir? Tienes opciones.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() =>
                  toast.success("¡Eres fuerte, sigue adelante, no te rindas hoy! 💪", {
                    duration: 5000,
                  })
                }
              >
                Aún no
              </AlertDialogCancel>
              <AlertDialogAction
                className="gradient-bg"
                onClick={() => {
                  onReset();
                  toast.success("Una recaída no te define. Mañana volvemos a empezar. 💜", {
                    duration: 5000,
                  });
                }}
              >
                Confirmar recaída
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}

const REMOVE_REASONS = [
  "La superé por completo",
  "La elegí por equivocación",
  "Quiero monitorearla en otro lugar",
  "Ya no aplica a mi vida",
];

function RemoveHabitDialog({
  onRemove,
  name,
}: {
  onRemove: (reason: string) => void;
  name: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Eliminar adicción"
          className="h-8 w-8 text-muted-foreground hover:text-red-300"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass border-white/10">
        <DialogHeader>
          <DialogTitle>Eliminar "{name}"</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Cuéntanos por qué la quitas (obligatorio):
        </p>
        <div className="space-y-1.5">
          {REMOVE_REASONS.map((r) => (
            <button
              key={r}
              onClick={() => setReason(r)}
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-left text-sm transition",
                reason === r
                  ? "border-violet-400/50 bg-violet-500/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10",
              )}
            >
              {r}
            </button>
          ))}
        </div>
        <Button
          disabled={!reason}
          onClick={() => {
            if (!reason) return;
            onRemove(reason);
            setOpen(false);
          }}
          className="mt-2 h-11 w-full gradient-bg disabled:opacity-50"
        >
          Eliminar adicción
        </Button>
      </DialogContent>
    </Dialog>
  );
}
