import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Trophy, Lock, Check, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHabits } from "@/hooks/use-habits";
import { MEDALS, tierColor, type Medal } from "@/lib/soberlife";
import { INITIAL_CHALLENGES, type Challenge } from "@/lib/challenges";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/retos")({
  component: Retos,
});

function Retos() {
  const { habits } = useHabits();
  const bestStreak = habits.reduce((m, h) => Math.max(m, h.bestStreak, h.currentDays), 0);
  const [challenges, setChallenges] = React.useState<Challenge[]>(INITIAL_CHALLENGES);

  return (
    <div className="px-5 pt-10 pb-4">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Gamificación</p>
        <h1 className="mt-1 text-3xl font-semibold">
          Retos y <span className="gradient-text">logros</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Mejor racha: <span className="font-semibold text-foreground">{bestStreak} días</span>
        </p>
      </header>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Medallas
      </h2>
      <div className="mb-8 grid grid-cols-2 gap-3">
        {MEDALS.map((m) => (
          <MedalCard key={m.id} medal={m} unlocked={bestStreak >= m.days} />
        ))}
      </div>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Retos especiales
      </h2>
      <div className="space-y-3">
        {challenges.map((c) => (
          <Card
            key={c.id}
            className={cn(
              "glass flex items-start gap-3 border-0 p-4",
              c.done && "ring-1 ring-emerald-400/30",
            )}
          >
            <button
              onClick={() =>
                setChallenges((prev) =>
                  prev.map((x) => (x.id === c.id ? { ...x, done: !x.done } : x)),
                )
              }
              className={cn(
                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border",
                c.done ? "border-emerald-400 bg-emerald-400/20" : "border-white/20 bg-white/5",
              )}
            >
              {c.done && <Check className="h-4 w-4 text-emerald-300" />}
            </button>
            <div className="flex-1">
              <p className={cn("text-sm font-semibold", c.done && "line-through opacity-70")}>
                {c.title}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{c.description}</p>
              {c.rewardTheme && (
                <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-violet-200">
                  <Sparkles className="h-3 w-3" />
                  Desbloquea: {c.rewardTheme}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Button asChild className="mt-6 h-11 w-full gradient-bg">
        <Link to="/nueva-meta">+ Añadir nueva meta</Link>
      </Button>
    </div>
  );
}

function MedalCard({ medal, unlocked }: { medal: Medal; unlocked: boolean }) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-0 p-4 text-center transition-all",
        unlocked ? "glass" : "bg-white/[0.02] opacity-60",
      )}
    >
      <div
        className={cn(
          "mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br shadow-xl",
          unlocked ? tierColor(medal.tier) : "from-slate-700 to-slate-800",
        )}
      >
        {unlocked ? (
          <Trophy className="h-8 w-8 text-white drop-shadow" />
        ) : (
          <Lock className="h-6 w-6 text-slate-400" />
        )}
      </div>
      <p className="text-sm font-semibold">{medal.name}</p>
      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        {medal.days} días
      </p>
    </Card>
  );
}