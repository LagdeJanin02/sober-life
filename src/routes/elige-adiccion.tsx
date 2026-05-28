import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, Check, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ADDICTIONS, TOP_5_ADDICTIONS, type Addiction } from "@/lib/addictions";
import { useHabits } from "@/hooks/use-habits";
import { todayKey, type HabitType } from "@/lib/soberlife";
import { cn } from "@/lib/utils";
import { COMMON_SYMPTOMS, searchBySymptom } from "@/lib/symptoms";
import { BackButton } from "@/components/back-button";

export const Route = createFileRoute("/elige-adiccion")({
  component: ElegirAdiccion,
});

function ElegirAdiccion() {
  const [q, setQ] = React.useState("");
  const [symptom, setSymptom] = React.useState("");
  const [mode, setMode] = React.useState<"name" | "symptom">("name");
  const [picked, setPicked] = React.useState<Addiction | null>(null);
  const { addHabit } = useHabits();
  const navigate = useNavigate();

  const list = React.useMemo(() => {
    if (mode === "symptom") {
      const r = searchBySymptom(symptom);
      return r.slice(0, 30);
    }
    const term = q.trim().toLowerCase();
    if (!term) return ADDICTIONS.filter((a) => TOP_5_ADDICTIONS.includes(a.id));
    return ADDICTIONS.filter((a) => a.name.toLowerCase().includes(term)).slice(0, 30);
  }, [q, symptom, mode]);

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
      <BackButton to="/login" />
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Paso final</p>
        <h1 className="mt-1 text-3xl font-semibold">
          ¿Qué quieres <span className="gradient-text">dejar</span>?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Base de +15,000 adicciones clasificadas. Te mostramos las 5 más comunes; si no
          conoces la tuya, búscala por síntoma.
        </p>
      </header>

      <div className="mb-3 flex gap-2">
        <Button
          variant={mode === "name" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("name")}
          className={cn("flex-1", mode === "name" ? "gradient-bg" : "border-white/10 bg-white/5")}
        >
          <Search className="mr-1 h-4 w-4" /> Por nombre
        </Button>
        <Button
          variant={mode === "symptom" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("symptom")}
          className={cn("flex-1", mode === "symptom" ? "gradient-bg" : "border-white/10 bg-white/5")}
        >
          <Stethoscope className="mr-1 h-4 w-4" /> Por síntoma
        </Button>
      </div>

      {mode === "name" ? (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar entre 15,000 adicciones..."
            className="h-11 border-white/10 bg-white/5 pl-9"
          />
        </div>
      ) : (
        <div className="mb-4">
          <Input
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            placeholder="ansiedad, insomnio, compulsión..."
            className="h-11 border-white/10 bg-white/5"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {COMMON_SYMPTOMS.map((s) => (
              <button
                key={s}
                onClick={() => setSymptom(s)}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-white/10"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
        {list.length === 0 && (
          <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-center text-xs text-muted-foreground">
            No encontramos coincidencias. Prueba con otro término o cambia de modo.
          </p>
        )}
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