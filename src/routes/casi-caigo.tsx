import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, PhoneCall, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/back-button";

export const Route = createFileRoute("/casi-caigo")({
  component: CasiCaigo,
});

function CasiCaigo() {
  const navigate = useNavigate();
  const [sec, setSec] = React.useState(8);
  const [connected, setConnected] = React.useState(false);

  React.useEffect(() => {
    if (connected) return;
    if (sec <= 0) {
      setConnected(true);
      return;
    }
    const t = setTimeout(() => setSec((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [sec, connected]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950/40 via-background to-background px-5 pt-12 pb-4">
      <BackButton to="/" />
      <div className="mx-auto mt-4 max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-red-500/20 ring-4 ring-red-500/30">
          <AlertCircle className="h-10 w-10 text-red-300" />
        </div>
        <h1 className="mt-5 text-3xl font-bold text-red-200">¡Estamos contigo!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Reunión de emergencia 24/7 con especialista internacional.
        </p>

        {!connected ? (
          <Card className="glass mt-8 border border-red-500/30 p-6">
            <p className="text-xs uppercase tracking-wider text-red-200">Conectando</p>
            <p className="mt-3 font-mono text-6xl font-bold text-red-300">{sec}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              Buscando al especialista disponible en tu idioma...
            </p>
            <div className="mt-5 flex justify-center gap-2">
              {["🇩🇴", "🇪🇸", "🇺🇸", "🇧🇷", "🇫🇷"].map((f, i) => (
                <span
                  key={i}
                  className="text-2xl"
                  style={{ animation: `pulse 1s ${i * 0.15}s infinite` }}
                >
                  {f}
                </span>
              ))}
            </div>
          </Card>
        ) : (
          <Card className="glass mt-8 border border-emerald-500/30 p-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
              <PhoneCall className="h-8 w-8 text-emerald-300" />
            </div>
            <p className="mt-3 text-base font-semibold text-emerald-200">Dra. Helena Vasconcelos</p>
            <p className="text-xs text-muted-foreground">Psiquiatra internacional · Idioma: Español</p>
            <p className="mt-4 rounded-lg bg-white/5 p-3 text-sm italic leading-relaxed">
              "Hola. Respira despacio conmigo: 4 segundos inhalas, 4 retienes, 6 exhalas.
              No estás solo/a. Cuéntame qué está pasando ahora mismo."
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button className="h-11 gradient-bg">
                <PhoneCall className="mr-1 h-4 w-4" /> Audio
              </Button>
              <Button variant="outline" className="h-11 border-white/10 bg-white/5">
                <Globe className="mr-1 h-4 w-4" /> Cambiar idioma
              </Button>
            </div>
          </Card>
        )}

        <Button
          variant="ghost"
          onClick={() => navigate({ to: "/" })}
          className="mt-6 text-sm text-muted-foreground"
        >
          Ya estoy mejor, volver al inicio
        </Button>
      </div>
    </div>
  );
}