import * as React from "react";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import {
  User, Users, Building2, Trees, CalendarIcon, CreditCard,
  Banknote, Wallet, Coins, Check, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { BackButton } from "@/components/back-button";
import { PROFESSIONALS } from "@/lib/community";
import { CURRENCIES, formatPrice, type Currency } from "@/lib/currency";
import { useAppointments } from "@/hooks/use-appointments";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/medico/$id/agendar")({
  component: Agendar,
});

const HOURS = [
  "08:00", "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
];

const PAYMENTS: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "tarjeta", label: "Tarjeta Visa / Mastercard / Amex", icon: CreditCard },
  { id: "transferencia", label: "Transferencia bancaria", icon: Banknote },
  { id: "paypal", label: "PayPal", icon: Wallet },
  { id: "efectivo", label: "Efectivo en consultorio", icon: Coins },
];

function Agendar() {
  const { id } = useParams({ from: "/medico/$id/agendar" });
  const navigate = useNavigate();
  const appointments = useAppointments();
  const doctor = PROFESSIONALS.find((p) => p.id === id);

  const [step, setStep] = React.useState(1);
  const [modality, setModality] = React.useState<"Individual" | "Grupal" | null>(null);
  const [space, setSpace] = React.useState<"Consultorio clínico" | "Aire libre" | null>(null);
  const [date, setDate] = React.useState<Date | undefined>();
  const [time, setTime] = React.useState<string | null>(null);
  const [payment, setPayment] = React.useState<string | null>(null);
  const [currency, setCurrency] = React.useState<Currency>("DOP");

  if (!doctor) {
    return (
      <div className="px-5 pt-12">
        <BackButton to="/agenda" />
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Profesional no encontrado.
        </p>
      </div>
    );
  }

  // Horarios ocupados simulados a partir del id del doctor
  const occupied = new Set(
    HOURS.filter((_, i) => (id.charCodeAt(1) * (i + 1)) % 4 === 0),
  );

  const canNext =
    (step === 1 && modality) ||
    (step === 2 && space) ||
    (step === 3 && date) ||
    (step === 4 && time) ||
    (step === 5 && payment) ||
    step === 6 ||
    step === 7;

  const next = () => setStep((s) => Math.min(7, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const confirm = () => {
    if (!modality || !space || !date || !time || !payment) return;
    appointments.add({
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorAvatar: doctor.avatar,
      modality,
      space,
      date: date.toISOString().slice(0, 10),
      time,
      payment: PAYMENTS.find((p) => p.id === payment)?.label ?? payment,
      currency,
      priceLabel: formatPrice(doctor.feeUSD, currency),
      status: "Confirmada",
    });
    toast.success("¡Cita confirmada! Te esperamos.", { duration: 4000 });
    navigate({ to: "/comunidad" });
  };

  const stepTitle = [
    "Paso 1 · Modalidad",
    "Paso 2 · Espacio",
    "Paso 3 · Fecha",
    "Paso 4 · Horario",
    "Paso 5 · Método de pago",
    "Paso 6 · Divisa",
    "Paso 7 · Confirmación",
  ][step - 1];

  return (
    <div className="px-5 pt-12 pb-4">
      <BackButton to="/agenda" />

      <header className="mb-4 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Agendar cita</p>
        <h1 className="mt-1 text-xl font-semibold">{doctor.name}</h1>
        <p className="text-xs text-violet-200">{doctor.specialty}</p>
      </header>

      {/* Stepper */}
      <div className="mb-5 flex items-center justify-between gap-1">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <div
            key={n}
            className={cn(
              "h-1.5 flex-1 rounded-full transition",
              n <= step ? "gradient-bg" : "bg-white/10",
            )}
          />
        ))}
      </div>
      <p className="mb-4 text-center text-xs font-semibold text-violet-200">{stepTitle}</p>

      <Card className="glass border-0 p-4">
        {step === 1 && (
          <div className="space-y-2">
            <Choice
              icon={User}
              label="Individual"
              desc="Sesión privada con el especialista, totalmente personalizada."
              active={modality === "Individual"}
              onClick={() => setModality("Individual")}
            />
            <Choice
              icon={Users}
              label="Grupal"
              desc="Sesión compartida con otros pacientes en proceso similar."
              active={modality === "Grupal"}
              onClick={() => setModality("Grupal")}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2">
            <Choice
              icon={Building2}
              label="Consultorio clínico"
              desc="Ambiente profesional, privacidad total y herramientas clínicas."
              active={space === "Consultorio clínico"}
              onClick={() => setSpace("Consultorio clínico")}
            />
            <Choice
              icon={Trees}
              label="Aire libre"
              desc="Caminata terapéutica en parque o espacio natural cercano."
              active={space === "Aire libre"}
              onClick={() => setSpace("Aire libre")}
            />
          </div>
        )}

        {step === 3 && (
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
              className={cn("p-3 pointer-events-auto")}
            />
          </div>
        )}

        {step === 4 && (
          <>
            <p className="mb-3 text-center text-xs text-muted-foreground">
              Horarios del doctor — los ocupados aparecen tachados.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {HOURS.map((h) => {
                const taken = occupied.has(h);
                return (
                  <button
                    key={h}
                    disabled={taken}
                    onClick={() => setTime(h)}
                    aria-label={`Horario ${h}${taken ? " ocupado" : ""}`}
                    className={cn(
                      "rounded-lg border px-2 py-3 text-sm font-medium transition",
                      taken
                        ? "cursor-not-allowed border-white/5 bg-white/5 text-muted-foreground line-through"
                        : time === h
                          ? "border-violet-400 gradient-bg text-white"
                          : "border-white/10 bg-white/5 hover:bg-white/10",
                    )}
                  >
                    {h}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 5 && (
          <div className="space-y-2">
            {PAYMENTS.map((p) => (
              <Choice
                key={p.id}
                icon={p.icon}
                label={p.label}
                active={payment === p.id}
                onClick={() => setPayment(p.id)}
              />
            ))}
          </div>
        )}

        {step === 6 && (
          <div className="space-y-2">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => setCurrency(c.code)}
                aria-label={`Divisa ${c.label}`}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg border px-3 py-3 text-left transition",
                  currency === c.code
                    ? "border-violet-400 bg-violet-500/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10",
                )}
              >
                <span className="flex items-center gap-3">
                  <span className="text-2xl">{c.flag}</span>
                  <span>
                    <p className="text-sm font-semibold">{c.label}</p>
                    <p className="text-[11px] text-muted-foreground">{c.code}</p>
                  </span>
                </span>
                <span className="text-right">
                  <p className="text-sm font-bold text-violet-200">
                    {formatPrice(doctor.feeUSD, c.code)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">por sesión</p>
                </span>
              </button>
            ))}
          </div>
        )}

        {step === 7 && (
          <div className="space-y-3">
            <p className="text-center text-sm font-semibold">Resumen de tu cita</p>
            <Summary label="Doctor" value={doctor.name} />
            <Summary label="Modalidad" value={modality ?? "—"} />
            <Summary label="Espacio" value={space ?? "—"} />
            <Summary label="Fecha" value={date?.toLocaleDateString("es") ?? "—"} />
            <Summary label="Hora" value={time ?? "—"} />
            <Summary
              label="Pago"
              value={PAYMENTS.find((p) => p.id === payment)?.label ?? "—"}
            />
            <Summary
              label="Total"
              value={formatPrice(doctor.feeUSD, currency)}
              highlight
            />
          </div>
        )}
      </Card>

      <div className="mt-5 flex gap-2">
        {step > 1 && (
          <Button
            variant="outline"
            onClick={back}
            className="h-11 flex-1 border-white/10 bg-white/5"
          >
            ← Modificar
          </Button>
        )}
        {step < 7 ? (
          <Button
            disabled={!canNext}
            onClick={next}
            className="h-11 flex-1 gradient-bg disabled:opacity-50"
          >
            Siguiente <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={confirm} className="h-11 flex-1 gradient-bg">
            <Check className="mr-1 h-4 w-4" /> Confirmar cita
          </Button>
        )}
      </div>
    </div>
  );
}

function Choice({
  icon: Icon,
  label,
  desc,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  desc?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border px-3 py-3 text-left transition",
        active
          ? "border-violet-400 bg-violet-500/10"
          : "border-white/10 bg-white/5 hover:bg-white/10",
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 text-violet-300" />
      <div className="flex-1">
        <p className="text-sm font-semibold">{label}</p>
        {desc && <p className="text-[11px] text-muted-foreground">{desc}</p>}
      </div>
      {active && <Check className="h-5 w-5 text-violet-300" />}
    </button>
  );
}

function Summary({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("text-sm font-semibold", highlight && "gradient-text text-lg")}>{value}</p>
    </div>
  );
}