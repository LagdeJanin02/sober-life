import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, Check, Stethoscope, ChevronRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ADDICTIONS, type Addiction } from "@/lib/addictions";
import { useHabits } from "@/hooks/use-habits";
import { todayKey, type HabitType } from "@/lib/soberlife";
import { cn } from "@/lib/utils";
import { COMMON_SYMPTOMS, searchBySymptom } from "@/lib/symptoms";

export const Route = createFileRoute("/elige-adiccion")({
  component: ElegirAdiccion,
});

const CATEGORIES = [
  {
    id: "sustancias",
    label: "Sustancias",
    emoji: "💊",
    description: "Alcohol, tabaco, drogas, vapeo y más",
  },
  {
    id: "conductuales",
    label: "Conductuales",
    emoji: "🎲",
    description: "Juego, compras compulsivas, trabajo excesivo",
  },
  {
    id: "alimentarias",
    label: "Alimentarias",
    emoji: "🍔",
    description: "Comida compulsiva, atracones, restricción",
  },
  {
    id: "digitales",
    label: "Digitales",
    emoji: "📱",
    description: "Videojuegos, redes sociales, internet",
  },
  {
    id: "emocionales",
    label: "Emocionales",
    emoji: "💭",
    description: "Dependencia emocional, codependencia",
  },
];

function ElegirAdiccion() {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [q, setQ] = React.useState("");
  const [symptom, setSymptom] = React.useState("");
  const [mode, setMode] = React.useState<"name" | "symptom">("name");
  const [picked, setPicked] = React.useState<Addiction | null>(null);
  const { addHabit } = useHabits();
  const navigate = useNavigate();

  const filteredByCategory = React.useMemo(() => {
    if (!selectedCategory) return [];
    return ADDICTIONS.filter(
      (a) => a.category?.toLowerCase() === selectedCategory,
    );
  }, [selectedCategory]);

  const list = React.useMemo(() => {
    if (!selectedCategory) return [];
    if (mode === "symptom") {
      return searchBySymptom(symptom)
        .filter((a) => a.category?.toLowerCase() === selectedCategory)
        .slice(0, 30);
    }
    const term = q.trim().toLowerCase();
    if (!term) return filteredByCategory;
    return filteredByCategory
      .filter((a) => a.name.toLowerCase().includes(term))
      .slice(0, 30);
  }, [q, symptom, mode, selectedCategory, filteredByCategory]);

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

  const handleBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
      setPicked(null);
      setQ("");
      setSymptom("");
    } else {
      navigate({ to: "/login" });
    }
  };

  return (
    <div className="px-5 pt-12">
      <button
        onClick={handleBack}
        className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {selectedCategory ? "Categorías" : "Volver"}
      </button>

      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Paso final
        </p>
        <h1 className="mt-1 text-3xl font-semibold">
          ¿Qué quieres <span className="gradient-text">dejar</span>?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {selectedCategory
            ? `Elige tu adicción en ${CATEGORIES.find((c) => c.id === selectedCategory)?.label}`
            : "Elige una categoría para explorar las adicciones disponibles."}
        </p>
      </header>

      {!selectedCategory && (
        <div className="space-y-3">
          {CATEGORIES.map((cat) => (
            <Card
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="flex cursor-pointer items-center gap-4 border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold">{cat.label}</p>
                <p className="text-xs text-muted-foreground">{cat.description}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Card>
          ))}
        </div>
      )}

      {selectedCategory && (
        <>
          <div className="mb-3 flex gap-2">
            <Button
              variant={mode === "name" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("name")}
              className={cn(
                "flex-1",
                mode === "name" ? "gradient-bg" : "border-white/10 bg-white/5",
              )}
            >
              <Search className="mr-1 h-4 w-4" /> Por nombre
            </Button>
            <Button
              variant={mode === "symptom" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("symptom")}
              className={cn(
                "flex-1",
                mode === "symptom" ? "gradient-bg" : "border-white/10 bg-white/5",
              )}
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
                placeholder="Buscar en esta categoría..."
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

          <div className="max-h-[40vh] space-y-2 overflow-y-auto pr-1">
            {list.length === 0 && (
              <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-center text-xs text-muted-foreground">
                No encontramos coincidencias en esta categoría. Prueba con otro término.
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
                  <p className="text-xs capitalize text-muted-foreground">
                    {a.category}
                  </p>
                </div>
                {picked?.id === a.id && (
                  <Check className="h-5 w-5 text-violet-300" />
                )}
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
        </>
      )}
    </div>
  );
}
