import { createFileRoute } from "@tanstack/react-router";
import { Phone, MapPin, Bus, TrainFront } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/back-button";
import { CENTROS, METRO_LINEAS, type Centro } from "@/lib/centros";
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

function Centros() {
  return (
    <div className="px-5 pt-12 pb-4">
      <BackButton to="/" />
      <header className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Ayuda local</p>
        <h1 className="mt-1 text-3xl font-semibold">
          Centros en <span className="gradient-text">RD 🇩🇴</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Conexiones con Metro de Santo Domingo y rutas OMSA.
        </p>
      </header>

      {/* Mapa simulado */}
      <Card className="glass relative mb-6 h-44 overflow-hidden border-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-sky-900/30 to-emerald-900/30" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:24px_24px]" />
        {/* Línea 1 vertical */}
        <div
          className="absolute left-[30%] top-4 bottom-4 w-1 rounded-full"
          style={{ background: METRO_LINEAS[1].color }}
        />
        {/* Línea 2 horizontal */}
        <div
          className="absolute top-[55%] left-4 right-4 h-1 rounded-full"
          style={{ background: METRO_LINEAS[2].color }}
        />
        {/* Estaciones */}
        {[20, 40, 60, 80].map((y) => (
          <span
            key={y}
            className="absolute h-2.5 w-2.5 rounded-full bg-white shadow"
            style={{ left: "30%", top: `${y}%`, transform: "translate(-50%,-50%)" }}
          />
        ))}
        {/* Centros como pines */}
        {[
          { l: "45%", t: "25%" },
          { l: "65%", t: "40%" },
          { l: "25%", t: "70%" },
          { l: "75%", t: "75%" },
        ].map((p, i) => (
          <span
            key={i}
            className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full gradient-bg text-[10px] font-bold text-white shadow-lg"
            style={{ left: p.l, top: p.t }}
          >
            ✚
          </span>
        ))}
        <div className="absolute bottom-2 left-2 rounded-md bg-black/40 px-2 py-1 text-[10px] backdrop-blur">
          Santo Domingo · Mapa simulado
        </div>
      </Card>

      <div className="mb-5 flex gap-3 text-[11px]">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-5 rounded-full" style={{ background: METRO_LINEAS[1].color }} />
          Metro Línea 1
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-5 rounded-full" style={{ background: METRO_LINEAS[2].color }} />
          Metro Línea 2
        </span>
      </div>

      <div className="space-y-3">
        {CENTROS.map((c) => (
          <Card key={c.id} className="glass border-0 p-4">
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