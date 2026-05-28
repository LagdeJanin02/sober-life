import { ArrowLeft } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function BackButton({ to }: { to?: string }) {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Volver"
      onClick={() => {
        if (to) router.navigate({ to });
        else router.history.back();
      }}
      className="fixed left-3 top-3 z-40 h-10 w-10 rounded-full border border-white/10 bg-black/40 backdrop-blur hover:bg-white/10"
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
}