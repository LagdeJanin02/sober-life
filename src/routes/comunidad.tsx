import { createFileRoute } from "@tanstack/react-router";
import { Calendar, MapPin, Video, Users, Coffee } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { COMMUNITY_EVENTS, type CommunityEvent } from "@/lib/community";

export const Route = createFileRoute("/comunidad")({
  component: Comunidad,
});

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("es", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function iconFor(t: CommunityEvent["type"]) {
  if (t === "virtual") return Video;
  if (t === "junte") return Coffee;
  return Users;
}

function Comunidad() {
  const reuniones = COMMUNITY_EVENTS.filter((e) => e.type !== "junte");
  const juntes = COMMUNITY_EVENTS.filter((e) => e.type === "junte");

  return (
    <div className="px-5 pt-10 pb-4">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Comunidad</p>
        <h1 className="mt-1 text-3xl font-semibold">
          Nadie sobra, <span className="gradient-text">todos suman</span>
        </h1>
      </header>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Reuniones de apoyo
      </h2>
      <div className="mb-8 space-y-3">
        {reuniones.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>

      <h2 className="mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        <Calendar className="h-4 w-4" />
        Calendario de juntes
      </h2>
      <div className="space-y-3">
        {juntes.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </div>
  );
}

function EventCard({ event }: { event: CommunityEvent }) {
  const Icon = iconFor(event.type);
  return (
    <Card className="glass border-0 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-xl gradient-bg p-2.5 shadow-lg shadow-violet-500/30">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">{event.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{event.description}</p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {fmt(event.date)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {event.location}
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => toast.success("¡Anotado! Te enviaremos recordatorio.")}
            className="mt-3 h-8 gradient-bg text-xs"
          >
            Inscribirme
          </Button>
        </div>
      </div>
    </Card>
  );
}