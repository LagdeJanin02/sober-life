import { createFileRoute } from "@tanstack/react-router";
import { Star, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PROFESSIONALS } from "@/lib/community";

export const Route = createFileRoute("/agenda")({
  component: Agenda,
});

function Agenda() {
  return (
    <div className="px-5 pt-10 pb-4">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Agenda médica</p>
        <h1 className="mt-1 text-3xl font-semibold">
          Profesionales <span className="gradient-text">certificados</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Psicólogos clínicos y psiquiatras especializados en adicciones.
        </p>
      </header>

      <div className="space-y-4">
        {PROFESSIONALS.map((p) => (
          <Card key={p.id} className="glass border-0 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                {p.avatar}
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold">{p.name}</p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-violet-200">
                  <Stethoscope className="h-3 w-3" />
                  {p.specialty}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{p.bio}</p>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 text-amber-300">
                    <Star className="h-3 w-3 fill-current" />
                    {p.rating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">{p.fee}</span>
                </div>
              </div>
            </div>
            <Button
              onClick={() => toast.success(`Solicitud enviada a ${p.name}`)}
              className="mt-4 h-10 w-full gradient-bg text-sm font-semibold"
            >
              Agendar cita
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}