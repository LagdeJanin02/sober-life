import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  LogOut, Trash2, Copy, Sun, Moon, Eye, Accessibility, Volume2,
  Plus, RefreshCw, Smartphone, QrCode,
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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { BackButton } from "@/components/back-button";
import {
  clearSession, listProfiles, saveSession, ensureCode,
  getActiveProfile, setActiveProfile, removeProfile, type Profile,
} from "@/lib/auth";
import { getTheme, setTheme } from "@/lib/theme";
import { getA11y, setA11y, type A11ySettings } from "@/lib/accessibility";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/configuracion")({
  component: Configuracion,
});

const AVATARS = ["💜", "🌷", "🌊", "🌙", "🔥", "🦋", "⚓", "🌱", "⭐", "🎯", "🧘", "🦁"];

function Configuracion() {
  const navigate = useNavigate();
  const [active, setActive] = React.useState<Profile | null>(null);
  const [profiles, setProfiles] = React.useState<Profile[]>([]);
  const [name, setName] = React.useState("");
  const [avatar, setAvatar] = React.useState("💜");
  const [theme, setLocalTheme] = React.useState<"dark" | "light">("dark");
  const [a11y, setLocalA11y] = React.useState<A11ySettings>({
    highContrast: false, screenReader: false, rampFilter: false,
  });

  const refresh = React.useCallback(() => {
    const p = getActiveProfile();
    setActive(p);
    setProfiles(listProfiles());
    if (p) { setName(p.name); setAvatar(p.avatar ?? "💜"); }
    setLocalTheme(getTheme());
    setLocalA11y(getA11y());
  }, []);

  React.useEffect(() => {
    refresh();
    window.addEventListener("soberlife:profile-change", refresh);
    return () => window.removeEventListener("soberlife:profile-change", refresh);
  }, [refresh]);

  const save = () => {
    if (!active) return;
    saveSession({ ...active, name, avatar });
    toast.success("Perfil actualizado ✨");
    refresh();
  };

  const logout = () => {
    clearSession();
    toast.success("Sesión cerrada");
    navigate({ to: "/welcome" });
  };

  const switchTo = (id: string) => {
    setActiveProfile(id);
    toast.success("Cuenta cambiada");
    refresh();
  };

  const remove = (id: string) => {
    removeProfile(id);
    toast.success("Cuenta eliminada");
    if (id === active?.id) {
      const remaining = listProfiles();
      if (remaining.length === 0) navigate({ to: "/welcome" });
    }
    refresh();
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

      {/* Perfil activo */}
      <Card className="glass mb-4 border-0 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-violet-200">
          Perfil
        </p>
        {active ? (
          <>
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
                  aria-label={`Avatar ${a}`}
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
                size="icon" variant="ghost" className="h-7 w-7"
                aria-label="Copiar código de amigo"
                onClick={() => {
                  navigator.clipboard?.writeText(code);
                  toast.success("Código copiado");
                }}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </Card>
            <Button onClick={save} className="mt-3 h-10 w-full gradient-bg">Guardar</Button>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">No hay perfil activo.</p>
        )}
      </Card>

      {/* Multi-cuenta */}
      <Card className="glass mb-4 border-0 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-violet-200">
          Cuentas guardadas ({profiles.length})
        </p>
        <div className="space-y-2">
          {profiles.map((p) => (
            <div
              key={p.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-2",
                p.id === active?.id
                  ? "border-violet-400 bg-violet-500/10"
                  : "border-white/10 bg-white/5",
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl">
                {p.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="text-[11px] text-muted-foreground">{p.email}</p>
              </div>
              {p.id !== active?.id && (
                <Button
                  size="sm" variant="outline"
                  className="h-8 border-white/10 bg-white/5"
                  onClick={() => switchTo(p.id)}
                >
                  <RefreshCw className="mr-1 h-3 w-3" /> Cambiar
                </Button>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="ghost" aria-label="Eliminar cuenta" className="h-8 w-8 text-muted-foreground hover:text-red-300">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass border-white/10">
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar "{p.name}"?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Se borrarán sus contadores, citas e inscripciones. Las demás cuentas se conservan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => remove(p.id)} className="bg-red-500 hover:bg-red-600">
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className="mt-3 h-10 w-full border-white/10 bg-white/5"
          onClick={() => navigate({ to: "/login" })}
        >
          <Plus className="mr-2 h-4 w-4" /> Añadir cuenta
        </Button>
      </Card>

      {/* Vincular dispositivo */}
      <Card className="glass mb-4 border-0 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-violet-200">
          Dispositivos vinculados
        </p>
        <div className="mb-2 flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-2">
          <Smartphone className="h-5 w-5 text-violet-300" />
          <div className="flex-1">
            <p className="text-sm font-semibold">Este dispositivo</p>
            <p className="text-[11px] text-muted-foreground">Sesión activa</p>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">
            Activo
          </span>
        </div>
        <VincularDispositivoDialog />
      </Card>

      {/* Tema */}
      <Card className="glass mb-4 border-0 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-violet-200">Tema</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className={cn(
              "flex-1 border-white/10",
              theme === "dark" ? "gradient-bg border-0 text-white" : "bg-white/5",
            )}
            onClick={() => { setTheme("dark"); setLocalTheme("dark"); toast.success("Modo oscuro activado"); }}
          >
            <Moon className="mr-1 h-4 w-4" /> Oscuro
          </Button>
          <Button
            variant="outline"
            className={cn(
              "flex-1 border-white/10",
              theme === "light" ? "gradient-bg border-0 text-white" : "bg-white/5",
            )}
            onClick={() => { setTheme("light"); setLocalTheme("light"); toast.success("Modo claro activado"); }}
          >
            <Sun className="mr-1 h-4 w-4" /> Claro
          </Button>
        </div>
      </Card>

      {/* Accesibilidad universal */}
      <Card className="glass mb-4 border-0 p-4">
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-200">
          <Accessibility className="h-4 w-4" /> Accesibilidad universal
        </p>
        <A11yRow
          icon={<Eye className="h-4 w-4" />}
          label="Alto contraste visual"
          checked={a11y.highContrast}
          onChange={(v) => { setA11y({ highContrast: v }); setLocalA11y((s) => ({ ...s, highContrast: v })); }}
        />
        <A11yRow
          icon={<Volume2 className="h-4 w-4" />}
          label="Lector de pantalla (TTS al tocar)"
          checked={a11y.screenReader}
          onChange={(v) => { setA11y({ screenReader: v }); setLocalA11y((s) => ({ ...s, screenReader: v })); }}
        />
        <A11yRow
          icon={<Accessibility className="h-4 w-4" />}
          label="Mapa: resaltar rampas accesibles ♿"
          checked={a11y.rampFilter}
          onChange={(v) => { setA11y({ rampFilter: v }); setLocalA11y((s) => ({ ...s, rampFilter: v })); }}
        />
      </Card>

      {/* Cuenta — cerrar sesión */}
      <Card className="glass mb-4 border-0 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-violet-200">Sesión</p>
        <Button
          variant="outline"
          onClick={logout}
          className="h-10 w-full border-white/10 bg-white/5"
        >
          <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión actual
        </Button>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Las demás cuentas guardadas en este dispositivo se conservan.
        </p>
      </Card>
    </div>
  );
}

function A11yRow({
  icon, label, checked, onChange,
}: { icon: React.ReactNode; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-violet-300">{icon}</span>
      <p className="flex-1 text-sm">{label}</p>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  );
}

function VincularDispositivoDialog() {
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [secondsLeft, setSecondsLeft] = React.useState(300);

  React.useEffect(() => {
    if (!open) return;
    const c = String(Math.floor(100000 + Math.random() * 900000));
    setCode(c);
    setSecondsLeft(300);
    const id = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [open]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10 w-full border-white/10 bg-white/5">
          <QrCode className="mr-2 h-4 w-4" /> Vincular nuevo dispositivo
        </Button>
      </DialogTrigger>
      <DialogContent className="glass border-white/10">
        <DialogHeader>
          <DialogTitle>Vincular dispositivo</DialogTitle>
        </DialogHeader>
        <div className="mx-auto mt-2 flex h-44 w-44 items-center justify-center rounded-2xl bg-white p-3">
          {/* QR simulado animado */}
          <svg viewBox="0 0 100 100" className="h-full w-full">
            {Array.from({ length: 64 }).map((_, i) => {
              const x = (i % 8) * 12 + 2;
              const y = Math.floor(i / 8) * 12 + 2;
              const fill = ((i * 7 + secondsLeft) % 3) === 0 ? "#000" : "#fff";
              return <rect key={i} x={x} y={y} width="11" height="11" fill={fill} />;
            })}
            <rect x="2" y="2" width="24" height="24" fill="none" stroke="#000" strokeWidth="3" />
            <rect x="74" y="2" width="24" height="24" fill="none" stroke="#000" strokeWidth="3" />
            <rect x="2" y="74" width="24" height="24" fill="none" stroke="#000" strokeWidth="3" />
          </svg>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Escanea el QR o introduce el código:
        </p>
        <p className="text-center font-mono text-3xl font-bold tracking-[0.4em] gradient-text">
          {code}
        </p>
        <p className="text-center text-xs text-muted-foreground">
          Expira en <span className="font-semibold text-foreground">{mm}:{ss}</span>
        </p>
      </DialogContent>
    </Dialog>
  );
}