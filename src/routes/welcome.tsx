import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Sparkles, Trophy, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/welcome")({
  component: Welcome,
});

const STEPS = [
  {
    icon: Sparkles,
    title: "Un día a la vez",
    text: "Pulsa 'Aumentar día' cada 24h para mantener tu racha viva. Si no lo haces antes de las 12:00 AM, la racha vuelve a cero. Sin trampas.",
  },
  {
    icon: Trophy,
    title: "Gánate medallas",
    text: "Bronce a los 3 días, Plata a los 7, Oro a los 30. Cumple retos para desbloquear temas visuales.",
  },
  {
    icon: Users,
    title: "No estás solo",
    text: "Únete a juntes presenciales y virtuales. Distracción sana con personas que entienden.",
  },
  {
    icon: BookOpen,
    title: "Aprende y agenda ayuda",
    text: "Consulta la enciclopedia de 100 adicciones y agenda con psicólogos y psiquiatras certificados.",
  },
];

function Welcome() {
  const navigate = useNavigate();
  const [i, setI] = React.useState(0);
  const Icon = STEPS[i].icon;
  const last = i === STEPS.length - 1;

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col px-5 pt-12">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Bienvenido</p>
      <h1 className="mt-1 text-3xl font-semibold">
        Empieza tu <span className="gradient-text">SoberLife</span>
      </h1>

      <Card className="glass mt-8 flex-1 border-0 p-6">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl gradient-bg shadow-xl shadow-violet-500/30">
          <Icon className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-center text-2xl font-semibold">{STEPS[i].title}</h2>
        <p className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
          {STEPS[i].text}
        </p>

        <div className="mt-8 flex justify-center gap-1.5">
          {STEPS.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-8 bg-violet-400" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
      </Card>

      <div className="my-6 flex gap-3">
        <Button
          variant="outline"
          className="flex-1 border-white/10 bg-white/5"
          onClick={() => navigate({ to: "/login" })}
        >
          Saltar
        </Button>
        <Button
          className="flex-1 gradient-bg"
          onClick={() => (last ? navigate({ to: "/login" }) : setI(i + 1))}
        >
          {last ? "Crear cuenta" : "Siguiente"}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}