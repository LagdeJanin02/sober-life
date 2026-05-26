import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Trophy, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/logros", label: "Logros", icon: Trophy },
  { to: "/nueva-meta", label: "Nueva", icon: Plus },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md px-4 pb-4 pt-2">
      <div className="glass flex items-center justify-around rounded-2xl px-2 py-2 shadow-2xl">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-medium transition-all",
                active
                  ? "gradient-bg text-white shadow-lg shadow-violet-500/30"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}