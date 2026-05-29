import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  useNavigate,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import * as React from "react";

import appCss from "../styles.css?url";
import { BottomNav } from "@/components/bottom-nav";
import { Toaster } from "@/components/ui/sonner";
import { loadSession, PUBLIC_ROUTES } from "@/lib/auth";
import { pushToHistory } from "@/lib/nav-history";
import { initTheme } from "@/lib/theme";
import { initA11y } from "@/lib/accessibility";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SoberLife" },
      { name: "description", content: "SoberLife tracks daily addictions and habits, offering a peaceful, modern platform for personal growth." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "SoberLife" },
      { property: "og:description", content: "SoberLife tracks daily addictions and habits, offering a peaceful, modern platform for personal growth." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "SoberLife" },
      { name: "twitter:description", content: "SoberLife tracks daily addictions and habits, offering a peaceful, modern platform for personal growth." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cb27ce0f-4246-4592-ac2e-483ea05758ea/id-preview-dfca7882--1d90ca2a-8a03-494e-99bd-ac3bc448751c.lovable.app-1779939203088.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cb27ce0f-4246-4592-ac2e-483ea05758ea/id-preview-dfca7882--1d90ca2a-8a03-494e-99bd-ac3bc448751c.lovable.app-1779939203088.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate />
      <Toaster theme="dark" position="top-center" />
    </QueryClientProvider>
  );
}

function AuthGate() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [authed, setAuthed] = React.useState<boolean | null>(null);

  // Inicializa tema y accesibilidad una sola vez (cliente).
  React.useEffect(() => {
    initTheme();
    initA11y();
  }, []);

  // Stack global de historial: registra cada cambio de ruta.
  React.useEffect(() => {
    pushToHistory(pathname);
  }, [pathname]);

  React.useEffect(() => {
    const refresh = () => setAuthed(!!loadSession());
    refresh();
    window.addEventListener("soberlife:profile-change", refresh);
    return () => window.removeEventListener("soberlife:profile-change", refresh);
  }, [pathname]);

  React.useEffect(() => {
    if (authed === false && !PUBLIC_ROUTES.has(pathname)) {
      navigate({ to: "/welcome" });
    }
  }, [authed, pathname, navigate]);

  if (authed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full gradient-bg" />
      </div>
    );
  }

  const showNav = authed && !PUBLIC_ROUTES.has(pathname);

  return (
    <>
      <main className="mx-auto min-h-screen max-w-md pb-28">
        <Outlet />
      </main>
      {showNav && <BottomNav />}
    </>
  );
}
