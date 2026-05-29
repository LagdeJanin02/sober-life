import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
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
import { profileKey } from "@/lib/auth";

export const Route = createFileRoute("/soporte")({
  component: Soporte,
});

interface SupportTicket {
  id: string;
  topic: string;
  email: string;
  message: string;
  createdAt: string;
}

function saveTicket(ticket: SupportTicket) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(profileKey("support_tickets"));
    const list: SupportTicket[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(profileKey("support_tickets"), JSON.stringify([...list, ticket]));
  } catch {
    /* almacenamiento no disponible */
  }
}

function Soporte() {
  const [topic, setTopic] = React.useState("tecnico");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) {
      toast.error("Completa tu correo y el mensaje.");
      return;
    }
    saveTicket({
      id: crypto.randomUUID(),
      topic,
      email: email.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    });
    toast.success("Mensaje enviado. Te responderemos en 24h.");
    setEmail("");
    setMessage("");
    setTopic("tecnico");
  };
  return (
    <div className="px-5 pt-10 pb-4">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Soporte</p>
        <h1 className="mt-1 text-3xl font-semibold">
          Estamos <span className="gradient-text">contigo</span>
        </h1>
      </header>

      <Card className="glass border-0 p-5">
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de mensaje</Label>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger className="h-11 border-white/10 bg-white/5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tecnico">Soporte técnico</SelectItem>
                <SelectItem value="sync">
                  Fallas de sincronización (reloj, tablet, PC)
                </SelectItem>
                <SelectItem value="sugerencia">Sugerencia de mejora</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tu correo</Label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="h-11 border-white/10 bg-white/5"
            />
          </div>
          <div className="space-y-2">
            <Label>Cuéntanos</Label>
            <Textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe la situación con el mayor detalle posible..."
              className="border-white/10 bg-white/5"
            />
          </div>
          <Button type="submit" className="h-12 w-full gradient-bg text-base font-semibold">
            Enviar mensaje
          </Button>
        </form>
      </Card>
    </div>
  );
}