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

type Gender = "f" | "m";

interface Specialist {
  name: string;
  title: string;
  gender: Gender;
  avatar: string;
}

// Especialistas disponibles (hombres y mujeres). Se elige uno al azar por llamada.
const SPECIALISTS: Specialist[] = [
  { name: "Dra. Valeria Cruz", title: "Psiquiatra · Apoyo inmediato 24/7", gender: "f", avatar: "👩‍⚕️" },
  { name: "Dr. Alejandro Méndez", title: "Psiquiatra · Apoyo inmediato 24/7", gender: "m", avatar: "👨‍⚕️" },
  { name: "Dra. Carmen Rosario", title: "Psicóloga clínica · Línea de crisis", gender: "f", avatar: "👩‍⚕️" },
  { name: "Dr. Luis Fernández", title: "Psicólogo clínico · Línea de crisis", gender: "m", avatar: "👨‍⚕️" },
  { name: "Dra. Patricia Gómez", title: "Especialista en adicciones · 24/7", gender: "f", avatar: "👩‍⚕️" },
  { name: "Dr. Rafael Núñez", title: "Especialista en adicciones · 24/7", gender: "m", avatar: "👨‍⚕️" },
];

// Mensajes de apoyo. Se elige uno al azar por llamada.
const MESSAGES: string[] = [
  "Hola, estoy aquí contigo. Respira profundo. Eres más fuerte de lo que crees. Esto que sientes es temporal. No estás solo. Cuéntame qué está pasando.",
  "Tranquilo. Has dado un paso enorme al pedir ayuda justo ahora. La urgencia que sientes va a bajar en unos minutos. Quédate conmigo y respira despacio.",
  "Lo que sientes es una ola y las olas siempre pasan. No tienes que decidir nada en este momento, solo respirar y dejar que baje. Estoy aquí acompañándote.",
  "Pensemos solo en los próximos diez minutos, nada más. Tú y yo, paso a paso. Recuerda por qué empezaste este camino: esa razón sigue ahí, intacta.",
  "Una recaída no borra todo tu avance, pero este momento es una oportunidad para demostrarte de lo que eres capaz. Respira conmigo: inhala... y suelta despacio.",
  "Estás a salvo. Bebe un poco de agua, suelta los hombros y respira. El impulso es fuerte, pero tú lo eres más. No estás solo en esto, te acompaño.",
];

// Voces típicas en español por género (heurística por nombre).
const FEMALE_VOICE_HINTS = ["mónica", "monica", "paulina", "helena", "laura", "sabina", "marisol", "lucía", "lucia", "female", "mujer"];
const MALE_VOICE_HINTS = ["jorge", "diego", "carlos", "juan", "pablo", "enrique", "miguel", "male", "hombre"];

function pickVoice(gender: Gender): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const es = voices.filter((v) => v.lang?.toLowerCase().startsWith("es"));
  const pool = es.length ? es : voices;
  const hints = gender === "f" ? FEMALE_VOICE_HINTS : MALE_VOICE_HINTS;
  const match = pool.find((v) => hints.some((h) => v.name.toLowerCase().includes(h)));
  if (match) return match;
  // Si no hay voz claramente del género buscado, intenta diferenciar por orden.
  if (es.length > 1) return gender === "f" ? es[0] : es[es.length - 1];
  return pool[0] ?? null;
}

function speak(text: string, gender: Gender) {
  try {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      console.error("El navegador o dispositivo actual no soporta la síntesis de voz (SpeechSynthesis).");
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();

    const emitir = () => {
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = "es-ES";
      const voice = pickVoice(gender);
      if (voice) msg.voice = voice;
      msg.rate = 0.9;
      // Tono más agudo para voz femenina, más grave para masculina (refuerza la diferencia).
      msg.pitch = gender === "f" ? 1.25 : 0.75;
      synth.speak(msg);
    };

    // Las voces pueden cargar de forma asíncrona la primera vez.
    if (!synth.getVoices().length) {
      const handler = () => {
        emitir();
        synth.removeEventListener("voiceschanged", handler);
      };
      synth.addEventListener("voiceschanged", handler);
      // Respaldo por si el evento no se dispara.
      setTimeout(emitir, 300);
    } else {
      emitir();
    }
  } catch {
    // Algunos navegadores bloquean el autoplay de audio; no debe romper la pantalla.
  }
}

function CasiCaigo() {
  const router = useRouter();

  // Especialista y mensaje aleatorios, fijados una sola vez por visita.
  const [specialist] = React.useState<Specialist>(
    () => SPECIALISTS[Math.floor(Math.random() * SPECIALISTS.length)],
  );
  const [message] = React.useState<string>(
    () => MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
  );

  React.useEffect(() => {
    speak(message, specialist.gender);
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [message, specialist.gender]);

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
              {specialist.avatar}
            </div>
          </div>

          <p className="mt-5 text-lg font-semibold">{specialist.name}</p>
          <p className="text-xs text-muted-foreground">{specialist.title}</p>

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
            "{message}"
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="h-11 border-white/10 bg-white/5"
              onClick={() => speak(message, specialist.gender)}
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
