import * as React from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { PhoneOff, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/back-button";
import { popFromHistory } from "@/lib/nav-history";

export const Route = createFileRoute("/casi-caigo")({
  component: CasiCaigo,
});

// Función global de apoyo solicitada por el usuario (TTS).
const reproducirMensajeApoyo = () => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    const synth = window.speechSynthesis;
    synth.cancel();
    const textoMotivacional =
      "Hola, estoy aquí contigo. Respira profundo. Eres más fuerte de lo que crees. " +
      "Esto que sientes es temporal. No estás solo. Cuéntame qué está pasando.";
    const msg = new SpeechSynthesisUtterance(textoMotivacional);
    msg.lang = navigator.language.startsWith("es") ? "es-ES" : "en-US";
    msg.rate = 0.85;
    msg.pitch = 1.1;
    synth.speak(msg);
  } else {
    console.error("El navegador o dispositivo actual no soporta la síntesis de voz (SpeechSynthesis).");
  }
};

const verificarSesionDispositivo = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      return localStorage.getItem("soberlife_session");
    } catch {
      console.warn("localStorage no disponible o bloqueado por políticas de privacidad.");
      return null;
    }
  }
  return null;
};

function CasiCaigo() {
  const router = useRouter();

  React.useEffect(() => {
    verificarSesionDispositivo();
    reproducirMensajeApoyo();
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const finalizar = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    const prev = popFromHistory();
    router.navigate({ to: prev ?? "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950/40 via-background to-background px-5 pt-12 pb-8">
      <BackButton to="/" />
      <div className="mx-auto mt-4 max-w-md text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-red-200/80">Reunión de emergencia virtual</p>
        <h1 className="mt-2 text-3xl font-bold text-red-100">No estás solo/a</h1>

        <Card className="glass mt-8 border border-red-500/30 p-6">
          {/* Avatar especialista */}
          <div className="relative mx-auto h-28 w-28">
            <div className="absolute inset-0 animate-ping rounded-full bg-red-500/30" />
            <div className="absolute inset-2 animate-pulse rounded-full bg-red-500/20" />
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-red-500 text-5xl shadow-2xl">
              👨‍⚕️
            </div>
          </div>

          <p className="mt-5 text-lg font-semibold">Dr. Alejandro Méndez</p>
          <p className="text-xs text-muted-foreground">Psiquiatra · Apoyo inmediato 24/7</p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
            <span className="text-xs font-medium text-red-200">En llamada...</span>
          </div>

          {/* Ondas de audio */}
          <div className="mt-6 flex h-12 items-center justify-center">
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className="audio-wave"
                style={{ animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>

          <p className="mt-4 rounded-lg bg-white/5 p-3 text-sm italic leading-relaxed">
            "Hola, estoy aquí contigo. Respira profundo. Eres más fuerte de lo que crees.
            Esto que sientes es temporal. No estás solo. Cuéntame qué está pasando."
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="h-11 border-white/10 bg-white/5"
              onClick={reproducirMensajeApoyo}
              aria-label="Repetir mensaje de apoyo"
            >
              <Mic className="mr-2 h-4 w-4" /> Repetir
            </Button>
            <Button
              className="h-11 bg-red-500 text-white hover:bg-red-600"
              onClick={finalizar}
              aria-label="Finalizar llamada"
            >
              <PhoneOff className="mr-2 h-4 w-4" /> Finalizar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}