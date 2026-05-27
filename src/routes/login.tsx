import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Wifi, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const handle = (label: string) => (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`${label} simulado — sincronización activa`);
    navigate({ to: "/elige-adiccion" });
  };

  return (
    <div className="px-5 pt-12">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Tu cuenta</p>
        <h1 className="mt-1 text-3xl font-semibold">
          Entra a <span className="gradient-text">SoberLife</span>
        </h1>
      </header>

      <Card className="glass mb-4 border-0 p-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <Wifi className="h-4 w-4 text-emerald-300" />
          <p className="text-xs text-emerald-200">
            Sincronización multi-dispositivo activa
          </p>
        </div>
      </Card>

      <Card className="glass border-0 p-5">
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2 bg-white/5">
            <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
            <TabsTrigger value="register">Crear cuenta</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-5 space-y-4">
            <form onSubmit={handle("Login")} className="space-y-4">
              <Field icon={Mail} label="Correo" type="email" placeholder="tu@correo.com" />
              <Field icon={Lock} label="Contraseña" type="password" placeholder="••••••••" />
              <Button type="submit" className="h-12 w-full gradient-bg text-base font-semibold">
                Entrar
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-5 space-y-4">
            <form onSubmit={handle("Registro")} className="space-y-4">
              <Field icon={User} label="Nombre" placeholder="Tu nombre" />
              <Field icon={Mail} label="Correo" type="email" placeholder="tu@correo.com" />
              <Field icon={Lock} label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" />
              <Button type="submit" className="h-12 w-full gradient-bg text-base font-semibold">
                Crear cuenta y elegir adicción
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        <Link to="/" className="underline">
          Continuar sin cuenta
        </Link>
      </p>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  ...rest
}: { icon: React.ComponentType<{ className?: string }>; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input required className="h-11 border-white/10 bg-white/5 pl-9" {...rest} />
      </div>
    </div>
  );
}