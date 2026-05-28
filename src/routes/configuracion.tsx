import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  LogOut, Trash2, Copy, Bell, Cloud, Sun, Moon,
  Eye, Accessibility, Volume2,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BackButton } from "@/components/back-button";
import { clearSession, loadSession, saveSession, ensureCode, type Session } from "@/lib/auth";

export const Route = createFileRoute("/configuracion")({
  component: Configuracion,
});

const AVATARS = ["💜", "🌷", "🌊", "🌙", "🔥", "🦋", "⚓", "🌱", "⭐", "🎯", "🧘", "🦁"];

function Configuracion() {
  const navigate = useNavigate();
  const [session, setSession] = React.useState<Session | null>(null);
  const [name, setName] = React.useState("");
  const [avatar, setAvatar] = React.useState("💜");

  React.useEffect(() => {
    const s = loadSession();
    if (s) {
      setSession(s);
      setName(s.name);
      setAvatar(s.avatar ?? "💜");
    }
  }, []);

  const save = () => {
    if (!session) return;
    const updated = { ...session, name, avatar };
    saveSession(updated);
    setSession(updated);
    toast.success("Perfil actualizado ✨");
  };

  const logout = () => {
    clearSession();
    toast.success("Sesión cerrada");
    navigate({ to: "/welcome" });
  };

  const deleteAccount = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    toast.success("Cuenta eliminada");
    navigate({ to: "/welcome" });
  };

  const code = ensureCode();

  return (
    <div className="px-5 pt-12 pb-4">
      <BackButton to="/mas" />
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Ajustes</p>
        <h1 className="mt-1 text-3xl font-semibold">
          <span className="gradient-text">Configuración</span>
        </h1>
      </header>

      {/* Perfil */}
      <Card className="glass mb-4 border-0 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-violet-200">
          Perfil
        </p>
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl">
            {avatar}
          </div>
          <div className="flex-1">
            <Label className="text-xs">Nombre</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 h-9 border-white/10 bg-white/5"
            />
          </div>
        </div>
        <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">Avatar</p>
        <div className="flex flex-wrap gap-1.5">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => setAvatar(a)}
              className={`h-9 w-9 rounded-lg text-xl transition ${
                avatar === a ? "gradient-bg ring-2 ring-violet-300" : "bg-white/5 hover:bg-white/10"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
        <Card className="mt-3 flex items-center gap-2 border-white/10 bg-white/5 p-2">
          <p className="flex-1 font-mono text-xs">{code}</p>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            aria-label="Copiar código"
            onClick={() => {
              navigator.clipboard?.writeText(code);
              toast.success("Código copiado");
            }}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </Card>
        <Button onClick={save} className="mt-3 h-10 w-full gradient-bg">Guardar</Button>
      </Card>

      {/* Notificaciones */}
      <Card className="glass mb-4 border-0 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-violet-200">
          Notificaciones y sync
        </p>
        <Row icon={<Bell className="h-4 w-4" />} label="Recordatorio matutino (8:00 AM)" defaultChecked />
        <Row icon={<Bell className="h-4 w-4" />} label="Recordatorio nocturno (10:00 PM)" defaultChecked />
        <Row icon={<Cloud className="h-4 w-4" />} label="Sincronización multi-dispositivo" defaultChecked />
      </Card>

      {/* Tema */}
      <Card className="glass mb-4 border-0 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-violet-200">Tema</p>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 gradient-bg border-0">
            <Moon className="mr-1 h-4 w-4" /> Oscuro
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-white/10 bg-white/5"
            onClick={() => toast.info("Modo claro próximamente")}
          >
            <Sun className="mr-1 h-4 w-4" /> Claro
          </Button>
        </div>
      </Card>

      {/* Accesibilidad */}
      <Card className="glass mb-4 border-0 p-4">
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-200">
          <Accessibility className="h-4 w-4" /> Accesibilidad universal
        </p>
        <Row icon={<Eye className="h-4 w-4" />} label="Alto contraste visual" />
        <Row icon={<Volume2 className="h-4 w-4" />} label="Lector de pantalla activo" />
        <Row icon={<Accessibility className="h-4 w-4" />} label="Filtro mapa: rampas accesibles" />
      </Card>

      {/* Cuenta */}
      <Card className="glass mb-4 border-0 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-violet-200">Cuenta</p>
        <Button
          variant="outline"
          onClick={logout}
          className="mb-2 h-10 w-full border-white/10 bg-white/5"
        >
          <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="h-10 w-full border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20">
              <Trash2 className="mr-2 h-4 w-4" /> Eliminar cuenta
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="glass border-white/10">
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar cuenta?</AlertDialogTitle>
              <AlertDialogDescription>
                Se borrarán tus contadores, medallas y configuración local. Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={deleteAccount} className="bg-red-500 hover:bg-red-600">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </div>
  );
}

function Row({
  icon, label, defaultChecked,
}: { icon: React.ReactNode; label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-violet-300">{icon}</span>
      <p className="flex-1 text-sm">{label}</p>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}