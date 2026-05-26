import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHabits } from "@/hooks/use-habits";
import { HABIT_PRESETS, type HabitType } from "@/lib/soberlife";

export const Route = createFileRoute("/nueva-meta")({
  component: NuevaMeta,
});

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function NuevaMeta() {
  const { addHabit } = useHabits();
  const navigate = useNavigate();
  const [type, setType] = React.useState<HabitType>("fumar");
  const [customName, setCustomName] = React.useState("");
  const [date, setDate] = React.useState(todayISO());
  const [reason, setReason] = React.useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const preset = HABIT_PRESETS.find((p) => p.value === type)!;
    const name = type === "otro" ? customName.trim() || "Mi hábito" : preset.label;
    addHabit({
      name,
      type,
      startDate: new Date(date + "T00:00:00").toISOString(),
      reason: reason.trim(),
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
            <Label>Hábito a dejar</Label>
            <Select value={type} onValueChange={(v) => setType(v as HabitType)}>
              <SelectTrigger className="h-11 bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HABIT_PRESETS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.emoji} {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {type === "otro" && (
            <div className="space-y-2">
              <Label>Nombre personalizado</Label>
              <Input
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Ej. Sin azúcar"
                className="h-11 bg-white/5 border-white/10"
              />
            </div>
          )}

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
              placeholder="¿Por qué quieres lograrlo? Esto será tu recordatorio en los días difíciles."
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