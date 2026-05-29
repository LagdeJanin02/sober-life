import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Calendar, MapPin, Video, Users, Coffee, CheckCircle2, X,
  Stethoscope, MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { COMMUNITY_EVENTS, type CommunityEvent } from "@/lib/community";
import { useEnrollments } from "@/hooks/use-enrollments";
import { useAppointments } from "@/hooks/use-appointments";

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
  const enrollments = useEnrollments();
  const appointments = useAppointments();

  return (
    <div className="px-5 pt-10 pb-4">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Comunidad</p>
        <h1 className="mt-1 text-3xl font-semibold">
          Nadie sobra, <span className="gradient-text">todos suman</span>
        </h1>
      </header>

      <Tabs defaultValue="inscripciones">
        <TabsList className="grid w-full grid-cols-3 bg-white/5">
          <TabsTrigger value="inscripciones">Mis inscripciones</TabsTrigger>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
          <TabsTrigger value="amigos">Amigos</TabsTrigger>
        </TabsList>

        {/* TAB 1 — Mis inscripciones */}
        <TabsContent value="inscripciones" className="mt-5 space-y-6">
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-200">
              <Stethoscope className="h-3.5 w-3.5" />
              Citas médicas
            </h2>
            {appointments.items.length === 0 ? (
              <Card className="glass border-0 p-4 text-center text-xs text-muted-foreground">
                Aún no tienes citas. Reserva una desde{" "}
                <Link to="/agenda" className="underline">Agenda médica</Link>.
              </Card>
            ) : (
              <div className="space-y-3">
                {appointments.items.map((a) => (
                  <Card key={a.id} className="glass border-0 p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{a.doctorAvatar}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{a.doctorName}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.modality} · {a.space}
                        </p>
                        <p className="mt-1 text-xs">
                          📅 {a.date} · 🕐 {a.time}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {a.payment} · {a.priceLabel}
                        </p>
                        <span
                          className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            a.status === "Confirmada"
                              ? "bg-emerald-500/20 text-emerald-200"
                              : "bg-amber-500/20 text-amber-200"
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-red-300"
                        aria-label="Cancelar cita"
                        onClick={() => {
                          appointments.cancel(a.id);
                          toast.success("Cita cancelada");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-200">
              <Calendar className="h-3.5 w-3.5" />
              Eventos suscritos
            </h2>
            {enrollments.items.length === 0 ? (
              <Card className="glass border-0 p-4 text-center text-xs text-muted-foreground">
                Aún no estás inscrito a ningún evento.
              </Card>
            ) : (
              <div className="space-y-3">
                {enrollments.items.map((e) => (
                  <Card key={e.id} className="glass border-0 p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{e.title}</p>
                        <p className="text-xs text-muted-foreground">{fmt(e.date)}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {e.location} · {e.modality}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-red-300"
                        aria-label="Cancelar inscripción"
                        onClick={() => {
                          enrollments.cancel(e.id);
                          toast.success("Inscripción cancelada");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </TabsContent>

        {/* TAB 2 — Eventos */}
        <TabsContent value="eventos" className="mt-5 space-y-3">
          {COMMUNITY_EVENTS.map((e) => {
            const Icon = iconFor(e.type);
            const isOn = enrollments.isEnrolled(e.id);
            return (
              <Card key={e.id} className="glass border-0 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl gradient-bg p-2.5 shadow-lg shadow-violet-500/30">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{e.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{e.description}</p>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {fmt(e.date)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {e.location}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      disabled={isOn}
                      onClick={() => {
                        const created = enrollments.enroll({
                          eventId: e.id,
                          title: e.title,
                          date: e.date,
                          location: e.location,
                          modality: e.type === "virtual" ? "Virtual" : e.type === "junte" ? "Junte" : "Presencial",
                        });
                        if (created) {
                          toast.success(
                            `Inscrito a "${e.title}" · ${fmt(e.date)}`,
                            { duration: 4000 },
                          );
                        }
                      }}
                      className={`mt-3 h-8 text-xs ${
                        isOn ? "bg-emerald-500/20 text-emerald-200" : "gradient-bg"
                      }`}
                    >
                      {isOn ? "Inscrito ✓" : "Inscribirme"}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>

        {/* TAB 3 — Amigos */}
        <TabsContent value="amigos" className="mt-5 space-y-3">
          <Card className="glass border-0 p-5 text-center">
            <Users className="mx-auto h-8 w-8 text-violet-300" />
            <p className="mt-3 text-sm font-semibold">Red privada de amigos</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Añade amigos por código único y chatea con ellos.
            </p>
            <Button asChild className="mt-4 h-10 w-full gradient-bg">
              <Link to="/amigos">
                <MessageSquare className="mr-2 h-4 w-4" /> Abrir amigos y chat
              </Link>
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}