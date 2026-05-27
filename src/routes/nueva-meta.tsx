import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, Check } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useHabits } from "@/hooks/use-habits";
import { todayKey, type HabitType } from "@/lib/soberlife";
import { ADDICTIONS, TOP_5_ADDICTIONS, type Addiction } from "@/lib/addictions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/nueva-meta")({
  component: NuevaMeta,
});

function todayISO() {
  return todayKey();
}

function NuevaMeta() {
  const { addHabit } = useHabits();
  const navigate = useNavigate();
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Addiction | null>(null);
  const [date, setDate] = React.useState(todayISO());
  const [reason, setReason] = React.useState("");

  const list = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ADDICTIONS.filter((a) => TOP_5_ADDICTIONS.includes(a.id));
    return ADDICTIONS.filter(
      (a) => a.name.toLowerCase().includes(q) || a.category.includes(q),
    ).slice(0, 20);
  }, [query]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      toast.error("Elige una adicción primero");
      return;
    }
    const type: HabitType =
      selected.id === "tabaco"
        ? "fumar"
        : selected.id === "alcohol"
          ? "alcohol"
          : selected.id === "vapeo"
            ? "vapeo"
            : selected.id === "videojuegos"
              ? "videojuegos"
              : "otro";
    addHabit({
      name: `Sin ${selected.name}`,
      type,
      addictionId: selected.id,
      startDate: new Date(date + "T00:00:00").toISOString(),
      reason: reason.trim(),
      currentDays: 0,
      lastIncrementDate: null,
      bestStreak: 0,
    });
    toast.success("Nueva meta creada. ¡Vamos con todo!");
    navigate({ to: "/" });
  };

  return (
    <div className="px-5 pt-10">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Nueva meta</p>
        <h1 className="mt-1 text-3xl font-semibold">
          Empieza un <span className="gradient-text">nuevo camino</span>
        </h1>
      </header>

      <Card className="glass border-0 p-5">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Buscar entre 100 adicciones</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej. alcohol, redes, azúcar..."
                className="h-11 bg-white/5 border-white/10 pl-9"
              />
            </div>
            {!query && (
              <p className="text-xs text-muted-foreground">Las 5 más comunes ↓</p>
            )}
            <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
              {list.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setSelected(a)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
                    selected?.id === a.id
                      ? "border-violet-400/50 bg-violet-500/10 shadow-lg shadow-violet-500/20"
                      : "border-white/10 bg-white/5 hover:bg-white/10",
                  )}
                >
                  <span className="text-xl">{a.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-xs capitalize text-muted-foreground">{a.category}</p>
                  </div>
                  {selected?.id === a.id && <Check className="h-4 w-4 text-violet-300" />}
                </button>
              ))}
              {list.length === 0 && (
                <p className="px-2 py-4 text-center text-sm text-muted-foreground">
                  Sin resultados para "{query}"
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Fecha de inicio</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11 bg-white/5 border-white/10"
              />
              <Button
                type="button"
                variant="outline"
                className="h-11 border-white/10 bg-white/5"
                onClick={() => setDate(todayISO())}
              >
                Hoy
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Motivo principal</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="¿Por qué quieres lograrlo? Será tu recordatorio en los días difíciles."
              rows={4}
              className="bg-white/5 border-white/10"
            />
          </div>

          <Button type="submit" className="w-full h-12 gradient-bg text-base font-semibold">
            Crear meta
          </Button>
        </form>
      </Card>
    </div>
  );
}