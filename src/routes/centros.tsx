import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Phone, MapPin, Bus, TrainFront, Accessibility } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/back-button";
import { CENTROS, METRO_LINEAS, type Centro } from "@/lib/centros";
import { getA11y } from "@/lib/accessibility";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/centros")({
  component: Centros,
});

const tipoStyle: Record<Centro["tipo"], string> = {
  publico: "bg-emerald-500/15 text-emerald-200",
  clinica: "bg-violet-500/15 text-violet-200",
  ong: "bg-sky-500/15 text-sky-200",
  espiritual: "bg-amber-500/15 text-amber-200",
};

const L1 = METRO_LINEAS[1].color;
const L2 = METRO_LINEAS[2].color;
const OMSA_COLOR = "#F59E0B";

// Posiciones de los pines de cada centro en el mapa (viewBox 320x220), por índice.
const PIN_POS = [
  { x: 90, y: 45 },
  { x: 210, y: 120 },
  { x: 90, y: 150 },
  { x: 90, y: 120 },
  { x: 150, y: 85 },
  { x: 60, y: 95 },
  { x: 250, y: 60 },
  { x: 215, y: 178 },
];

// Estaciones de metro dibujadas (coordenadas en el viewBox).
const L1_STATIONS = [40, 70, 100, 130, 160, 190].map((y) => ({ x: 90, y }));
const L2_STATIONS = [60, 110, 160, 210, 260].map((x) => ({ x, y: 120 }));

// Rutas OMSA simuladas (polilíneas).
const OMSA_ROUTES = [
  {
    label: "OMSA · Corredor Máximo Gómez",
    points: "20,52 110,62 210,48 300,72",
    bus: { x: 18, y: 50 },
  },
  {
    label: "OMSA · Corredor 27 de Febrero",
    points: "28,192 110,178 205,186 296,162",
    bus: { x: 26, y: 190 },
  },
];

function Centros() {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [ramps, setRamps] = React.useState(false);

  React.useEffect(() => {
    const update = () => setRamps(getA11y().rampFilter);
    update();
    window.addEventListener("soberlife:a11y", update);
    return () => window.removeEventListener("soberlife:a11y", update);
  }, []);

  const selectCentro = (id: string) => {
    setSelected(id);
    if (typeof document !== "undefined") {
      document.getElementById(`centro-${id}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // Centros con metro se consideran accesibles (estaciones con rampa/ascensor).
  const pinned = CENTROS.slice(0, PIN_POS.length).map((c, i) => ({
    centro: c,
    pos: PIN_POS[i],
    accesible: !!c.metro,
  }));

  return (
    <div className="px-5 pt-12 pb-4">
      <BackButton to="/" />
      <header className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Ayuda local</p>
        <h1 className="mt-1 text-3xl font-semibold">
          Centros en <span className="gradient-text">RD 🇩🇴</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Conexiones con Metro de Santo Domingo y rutas OMSA. Toca un pin para ver el centro.
        </p>
      </header>

      {/* Mapa interactivo */}
      <Card className="glass relative mb-3 overflow-hidden border-0 p-0">
        <svg viewBox="0 0 320 220" className="block h-56 w-full">
          {/* Fondo */}
          <defs>
            <linearGradient id="mapBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b1f6e" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#0c4a6e" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="pinGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="320" height="220" fill="url(#mapBg)" />
          {/* Cuadrícula */}
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 26} y1="0" x2={i * 26} y2="220" stroke="rgba(255,255,255,0.08)" />
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 26} x2="320" y2={i * 26} stroke="rgba(255,255,255,0.08)" />
          ))}

          {/* Rutas OMSA (dashed) */}
          {OMSA_ROUTES.map((r) => (
            <polyline
              key={r.label}
              points={r.points}
              fill="none"
              stroke={OMSA_COLOR}
              strokeWidth="2.5"
              strokeDasharray="6 5"
              strokeLinecap="round"
            />
          ))}
          {OMSA_ROUTES.map((r) => (
            <text key={`bus-${r.label}`} x={r.bus.x} y={r.bus.y} fontSize="13">🚌</text>
          ))}

          {/* Metro Línea 1 (vertical) */}
          <line x1="90" y1="20" x2="90" y2="200" stroke={L1} strokeWidth="4" strokeLinecap="round" />
          {/* Metro Línea 2 (horizontal) */}
          <line x1="30" y1="120" x2="290" y2="120" stroke={L2} strokeWidth="4" strokeLinecap="round" />
          {/* Estaciones */}
          {[...L1_STATIONS, ...L2_STATIONS].map((s, i) => (
            <circle key={`st${i}`} cx={s.x} cy={s.y} r="3.2" fill="#fff" stroke="#1e293b" strokeWidth="0.6" />
          ))}

          {/* Pines de centros (interactivos) */}
          {pinned.map(({ centro, pos, accesible }) => {
            const isSel = selected === centro.id;
            return (
              <g
                key={centro.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => selectCentro(centro.id)}
                style={{ cursor: "pointer" }}
              >
                {isSel && <circle r="13" fill="none" stroke="#fff" strokeWidth="2" />}
                <circle r="9" fill="url(#pinGrad)" stroke="#fff" strokeWidth="1" />
                <text textAnchor="middle" y="3.5" fontSize="10" fill="#fff" fontWeight="bold">✚</text>
                {ramps && accesible && (
                  <text x="11" y="-7" fontSize="12" className="ramp-marker">♿</text>
                )}
              </g>
            );
          })}

          <text x="6" y="214" fontSize="8" fill="rgba(255,255,255,0.6)">Santo Domingo · mapa simulado</text>
        </svg>
      </Card>

      {/* Leyenda */}
      <div className="mb-5 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px]">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-5 rounded-full" style={{ background: L1 }} />
          Metro L1
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-5 rounded-full" style={{ background: L2 }} />
          Metro L2
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-0 w-5 border-t-2 border-dashed"
            style={{ borderColor: OMSA_COLOR }}
          />
          🚌 OMSA
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full gradient-bg text-[8px] text-white">✚</span>
          Centro
        </span>
        {ramps && (
          <span className="inline-flex items-center gap-1.5 text-emerald-200">
            ♿ Acceso para sillas de ruedas
          </span>
        )}
      </div>

      {!ramps && (
        <p className="mb-4 flex items-center gap-1.5 rounded-lg bg-white/5 p-2 text-[11px] text-muted-foreground">
          <Accessibility className="h-3.5 w-3.5 text-violet-300" />
          Activa “Mapa: resaltar rampas accesibles” en Ajustes para ver los accesos ♿ en el mapa.
        </p>
      )}

      <div className="space-y-3">
        {CENTROS.map((c) => (
          <Card
            key={c.id}
            id={`centro-${c.id}`}
            className={cn(
              "glass border-0 p-4 transition",
              selected === c.id && "ring-2 ring-violet-400",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-base font-semibold leading-tight">{c.nombre}</p>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider",
                  tipoStyle[c.tipo],
                )}
              >
                {c.tipo}
              </span>
            </div>
            <p className="mt-1 flex items-start gap-1 text-xs text-muted-foreground">
              <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
              {c.direccion}, {c.ciudad}
            </p>
            <a
              href={`tel:${c.telefono.replace(/[^0-9+]/g, "")}`}
              className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-300"
            >
              <Phone className="h-3 w-3" />
              {c.telefono}
            </a>
            <div className="mt-2 flex flex-wrap gap-1">
              {c.especialidades.map((e) => (
                <span
                  key={e}
                  className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground"
                >
                  {e}
                </span>
              ))}
            </div>
            {c.metro && (
              <p
                className="mt-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px]"
                style={{ background: `${METRO_LINEAS[c.metro.linea].color}22`, color: METRO_LINEAS[c.metro.linea].color }}
              >
                <TrainFront className="h-3 w-3" />
                Metro L{c.metro.linea} · Estación {c.metro.estacion}
                {ramps && <span className="ml-1 text-emerald-300">· ♿ accesible</span>}
              </p>
            )}
            {c.rutaOmsa && c.rutaOmsa.length > 0 && (
              <div className="mt-1 space-y-0.5">
                {c.rutaOmsa.map((r) => (
                  <p
                    key={r}
                    className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/15 px-2 py-1 text-[11px] text-amber-200"
                  >
                    <Bus className="h-3 w-3" />
                    OMSA · {r}
                  </p>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
