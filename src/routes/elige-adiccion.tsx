import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, Check } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ADDICTIONS, TOP_5_ADDICTIONS, type Addiction } from "@/lib/addictions";
import { useHabits } from "@/hooks/use-habits";
import { todayKey, type HabitType } from "@/lib/soberlife";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/elige-adiccion")({
  component: ElegirAdiccion,
});

function ElegirAdiccion() {
  const [q, setQ] = React.useState("");
  const [picked, setPicked] = React.useState<Addiction | null>(null);
  const { addHabit } = useHabits();
  const navigate = useNavigate();

  const list = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return ADDICTIONS.filter((a) => TOP_5_ADDICTIONS.includes(a.id));
    return ADDICTIONS.filter((a) => a.name.toLowerCase().includes(term)).slice(0, 30);
  }, [q]);

  const confirm = () => {
    if (!picked) return;
    const type: HabitType =
      picked.id === "tabaco"
        ? "fumar"
        : picked.id === "alcohol"
          ? "alcohol"
          : picked.id === "vapeo"
            ? "vapeo"
            : picked.id === "videojuegos"
              ? "videojuegos"
              : "otro";
    addHabit({
      name: `Sin ${picked.name}`,
      type,
      addictionId: picked.id,
      startDate: new Date(todayKey() + "T00:00:00").toISOString(),
      reason: "",
      currentDays: 0,
      lastIncrementDate: null,
      bestStreak: 0,
    });
    toast.success("¡Listo! Tu primer hábito está activo.");
    navigate({ to: "/" });
  };

  return (
    <div className="px-5 pt-12">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Paso final</p>
        <h1 className="mt-1 text-3xl font-semibold">
          ¿Qué quieres <span className="gradient-text">dejar</span>?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Las 5 más comunes están abajo. Busca entre las 100 si necesitas otra.
        </p>
      </header>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar adicción..."
          className="h-11 border-white/10 bg-white/5 pl-9"
        />
      </div>

      <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
        {list.map((a) => (
          <Card
            key={a.id}
            onClick={() => setPicked(a)}
            className={cn(
              "flex cursor-pointer items-center gap-3 border bg-white/5 p-3 transition-all",
              picked?.id === a.id
                ? "border-violet-400/50 bg-violet-500/10"
                : "border-white/10 hover:bg-white/10",
            )}
          >
            <span className="text-2xl">{a.emoji}</span>
            <div className="flex-1">
              <p className="text-sm font-medium">{a.name}</p>
              <p className="text-xs capitalize text-muted-foreground">{a.category}</p>
            </div>
            {picked?.id === a.id && <Check className="h-5 w-5 text-violet-300" />}
          </Card>
        ))}
      </div>

      <Button
        onClick={confirm}
        disabled={!picked}
        className="mt-6 h-12 w-full gradient-bg text-base font-semibold disabled:opacity-50"
      >
        Empezar ahora
      </Button>
    </div>
  );
}