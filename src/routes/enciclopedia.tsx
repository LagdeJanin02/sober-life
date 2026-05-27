import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  ADDICTIONS,
  CATEGORY_LABELS,
  type Addiction,
  type AddictionCategory,
} from "@/lib/addictions";

export const Route = createFileRoute("/enciclopedia")({
  component: Enciclopedia,
});

function Enciclopedia() {
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState<Addiction | null>(null);

  const grouped = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    const filtered = term
      ? ADDICTIONS.filter((a) => a.name.toLowerCase().includes(term))
      : ADDICTIONS;
    const out: Record<AddictionCategory, Addiction[]> = {
      sustancias: [],
      conductuales: [],
      alimentarias: [],
      digitales: [],
      emocionales: [],
    };
    filtered.forEach((a) => out[a.category].push(a));
    return out;
  }, [q]);

  return (
    <div className="px-5 pt-10 pb-4">
      <header className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Enciclopedia</p>
        <h1 className="mt-1 text-3xl font-semibold">
          100 <span className="gradient-text">adicciones</span>
        </h1>
      </header>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar..."
          className="h-11 border-white/10 bg-white/5 pl-9"
        />
      </div>

      {(Object.keys(grouped) as AddictionCategory[]).map((cat) =>
        grouped[cat].length > 0 ? (
          <section key={cat} className="mb-6">
            <h2 className="mb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {CATEGORY_LABELS[cat]} <span className="text-xs">({grouped[cat].length})</span>
            </h2>
            <div className="space-y-2">
              {grouped[cat].map((a) => (
                <button
                  key={a.id}
                  onClick={() => setOpen(a)}
                  className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-left transition-all hover:bg-white/10"
                >
                  <span className="text-xl">{a.emoji}</span>
                  <span className="flex-1 text-sm font-medium">{a.name}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </section>
        ) : null,
      )}

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent side="bottom" className="glass max-h-[85vh] overflow-y-auto border-white/10">
          {open && (
            <>
              <SheetHeader className="text-left">
                <SheetTitle className="text-2xl">
                  <span className="mr-2 text-3xl">{open.emoji}</span>
                  {open.name}
                </SheetTitle>
                <SheetDescription className="capitalize text-violet-200">
                  {CATEGORY_LABELS[open.category]}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-5 space-y-5">
                <Section title="Información">
                  <p className="text-sm text-muted-foreground">{open.info}</p>
                </Section>
                <Section title="Causas comunes">
                  <List items={open.causes} />
                </Section>
                <Section title="Síntomas">
                  <List items={open.symptoms} />
                </Section>
                <Section title="Soluciones y consejos">
                  <List items={open.solutions} />
                </Section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="glass border-0 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-200">
        {title}
      </p>
      {children}
    </Card>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2 text-sm text-muted-foreground">
          <span className="text-violet-300">•</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}