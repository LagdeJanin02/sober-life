import { createFileRoute } from "@tanstack/react-router";
import { Trophy, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useHabits } from "@/hooks/use-habits";
import { MEDALS, daysSince, tierColor, type Medal } from "@/lib/soberlife";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/logros")({
  component: Logros,
});

function Logros() {
  const { habits } = useHabits();
  const bestStreak = habits.reduce((max, h) => Math.max(max, daysSince(h.startDate)), 0);

  return (
    <div className="px-5 pt-10">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Recompensas</p>
        <h1 className="mt-1 text-3xl font-semibold">
          Tus <span className="gradient-text">medallas</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Mejor racha actual:{" "}
          <span className="font-semibold text-foreground">{bestStreak} días</span>
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {MEDALS.map((m) => (
          <MedalCard key={m.id} medal={m} unlocked={bestStreak >= m.days} />
        ))}
      </div>
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
          "mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br shadow-xl",
          unlocked ? tierColor(medal.tier) : "from-slate-700 to-slate-800",
        )}
      >
        {unlocked ? (
          <Trophy className="h-9 w-9 text-white drop-shadow" />
        ) : (
          <Lock className="h-7 w-7 text-slate-400" />
        )}
      </div>
      <p className="text-sm font-semibold">{medal.name}</p>
      <p className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">
        {medal.days} {medal.days === 1 ? "día" : "días"}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{medal.description}</p>
    </Card>
  );
}