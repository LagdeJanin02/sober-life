import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Plus,
  Stethoscope,
  HelpCircle,
  LogIn,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/mas")({
  component: Mas,
});

const links = [
  { to: "/nueva-meta", label: "Nueva meta", desc: "Añade un hábito a monitorear", icon: Plus },
  { to: "/agenda", label: "Agenda médica", desc: "Psicólogos y psiquiatras", icon: Stethoscope },
  {
    to: "/soporte",
    label: "Soporte y contacto",
    desc: "Reportar fallas o sugerencias",
    icon: HelpCircle,
  },
  {
    to: "/welcome",
    label: "Tutorial de bienvenida",
    desc: "Repasa cómo funciona la app",
    icon: Sparkles,
  },
  { to: "/login", label: "Cuenta", desc: "Iniciar sesión o registrarse", icon: LogIn },
] as const;

function Mas() {
  return (
    <div className="px-5 pt-10 pb-4">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Más opciones</p>
        <h1 className="mt-1 text-3xl font-semibold">
          Tu <span className="gradient-text">SoberLife</span>
        </h1>
      </header>

      <div className="space-y-3">
        {links.map(({ to, label, desc, icon: Icon }) => (
          <Link key={to} to={to}>
            <Card className="glass flex items-center gap-3 border-0 p-4 transition-all hover:bg-white/10">
              <div className="rounded-xl gradient-bg p-2.5 shadow-lg shadow-violet-500/30">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}