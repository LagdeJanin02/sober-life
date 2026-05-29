import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy, UserPlus, Check, X, MessagesSquare, Users } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BackButton } from "@/components/back-button";
import { GROUPS } from "@/lib/friends";
import { ensureCode } from "@/lib/auth";
import { useFriends } from "@/hooks/use-friends";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/amigos")({
  component: Amigos,
});

function Amigos() {
  const [code, setCode] = React.useState("SL-XXXXXX");
  const [addCode, setAddCode] = React.useState("");
  const {
    friends,
    requests: reqs,
    addByCode,
    acceptRequest,
    rejectRequest,
    joinGroup,
    leaveGroup,
    isInGroup,
  } = useFriends();

  React.useEffect(() => setCode(ensureCode()), []);

  const copy = () => {
    navigator.clipboard?.writeText(code);
    toast.success("Código copiado 📋");
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addCode.trim()) return;
    const res = addByCode(addCode);
    if (res.ok) {
      toast.success(`Solicitud enviada a ${addCode.trim().toUpperCase()}`);
      setAddCode("");
    } else {
      toast.error(res.error ?? "No se pudo enviar la solicitud");
    }
  };

  return (
    <div className="px-5 pt-12 pb-4">
      <BackButton to="/comunidad" />
      <header className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Red privada</p>
        <h1 className="mt-1 text-3xl font-semibold">
          Tus <span className="gradient-text">amigos</span>
        </h1>
      </header>

      <Card className="glass mb-5 border-0 p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Tu código</p>
        <div className="mt-1 flex items-center gap-2">
          <p className="flex-1 font-mono text-2xl font-bold gradient-text">{code}</p>
          <Button size="icon" variant="ghost" onClick={copy} aria-label="Copiar código">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Compártelo para que te agreguen a su red.
        </p>
      </Card>

      <form onSubmit={send} className="mb-6 flex gap-2">
        <Input
          value={addCode}
          onChange={(e) => setAddCode(e.target.value)}
          placeholder="SL-XXXXXX"
          className="h-11 border-white/10 bg-white/5 font-mono"
        />
        <Button type="submit" className="h-11 gradient-bg">
          <UserPlus className="mr-1 h-4 w-4" /> Añadir
        </Button>
      </form>

      <h2 className="mb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Amigos ({friends.length})
      </h2>
      <div className="mb-6 space-y-2">
        {friends.length === 0 && (
          <Card className="glass border-0 p-4 text-center text-xs text-muted-foreground">
            Aún no tienes amigos. Añade a alguien con su código <span className="font-mono">SL-XXXXXX</span> arriba.
          </Card>
        )}
        {friends.map((f) => (
          <Link
            key={f.id}
            to="/chat/$id"
            params={{ id: f.id }}
            className="block"
          >
            <Card className="glass flex items-center gap-3 border-0 p-3">
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl">
                  {f.avatar}
                </div>
                <span
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-background",
                    f.status === "online" ? "bg-emerald-400" : "bg-slate-500",
                  )}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{f.name}</p>
                  <span className="text-[10px] text-violet-200">🔥 {f.streak}d</span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{f.lastMessage}</p>
              </div>
              <MessagesSquare className="h-4 w-4 text-muted-foreground" />
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="mb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Solicitudes
      </h2>
      <div className="mb-6 space-y-2">
        {reqs.length === 0 && (
          <Card className="glass border-0 p-4 text-center text-xs text-muted-foreground">
            No tienes solicitudes pendientes.
          </Card>
        )}
        {reqs.map((r) => (
          <Card key={r.id} className="glass flex items-center gap-3 border-0 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg">
              {r.avatar}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{r.name}</p>
              <p className="font-mono text-[10px] text-muted-foreground">
                {r.code} · {r.direction === "in" ? "te quiere agregar" : "enviada"}
              </p>
            </div>
            {r.direction === "in" ? (
              <>
                <Button
                  size="icon"
                  className="h-8 w-8 gradient-bg"
                  aria-label="Aceptar"
                  onClick={() => {
                    acceptRequest(r.id);
                    toast.success(`Ahora son amigos`);
                  }}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Rechazar"
                  className="h-8 w-8 border-white/10 bg-white/5"
                  onClick={() => rejectRequest(r.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <span className="text-[10px] uppercase tracking-wider text-amber-300">Pendiente</span>
            )}
          </Card>
        ))}
      </div>

      <h2 className="mb-2 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        <Users className="h-4 w-4" /> Salas grupales
      </h2>
      <div className="space-y-2">
        {GROUPS.map((g) => {
          const joined = isInGroup(g.id);
          return (
            <Card key={g.id} className="glass border-0 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{g.name}</p>
                <span className="text-[10px] text-muted-foreground">
                  {joined ? g.members + 1 : g.members} miembros
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{g.topic}</p>
              <p className="mt-1.5 truncate text-xs text-violet-200">{g.lastMessage}</p>
              <Button
                size="sm"
                className={cn(
                  "mt-2 h-8 text-xs",
                  joined ? "bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/20" : "gradient-bg",
                )}
                onClick={() => {
                  if (joined) {
                    leaveGroup(g.id);
                    toast.success(`Saliste de ${g.name}`);
                  } else {
                    joinGroup(g.id);
                    toast.success(`Te uniste a ${g.name} 🎉`);
                  }
                }}
              >
                {joined ? "Unido ✓ · Salir" : "Unirme"}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}