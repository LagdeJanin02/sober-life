import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FRIENDS, CHATS, type ChatMessage } from "@/lib/friends";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat/$id")({
  component: Chat,
});

function Chat() {
  const { id } = Route.useParams();
  const friend = FRIENDS.find((f) => f.id === id);
  const [messages, setMessages] = React.useState<ChatMessage[]>(CHATS[id] ?? []);
  const [text, setText] = React.useState("");
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!friend) {
    return (
      <div className="px-5 pt-16">
        <BackButton to="/amigos" />
        <p className="text-center text-muted-foreground">Amigo no encontrado.</p>
      </div>
    );
  }

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const me: ChatMessage = {
      id: crypto.randomUUID(),
      from: "me",
      text,
      time: new Date().toISOString(),
    };
    setMessages((p) => [...p, me]);
    setText("");
    // simulated reply
    setTimeout(() => {
      setMessages((p) => [
        ...p,
        {
          id: crypto.randomUUID(),
          from: friend.id,
          text: "¡Te entiendo! Aquí estamos 💜",
          time: new Date().toISOString(),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <BackButton to="/amigos" />
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-background/80 px-5 py-3 pl-16 backdrop-blur">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg">
          {friend.avatar}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">{friend.name}</p>
          <p className="text-[10px] text-emerald-300">
            {friend.status === "online" ? "En línea" : "Desconectado"} · 🔥 {friend.streak} días
          </p>
        </div>
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {messages.map((m) => {
          const mine = m.from === "me";
          return (
            <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                  mine
                    ? "gradient-bg rounded-br-sm text-white"
                    : "rounded-bl-sm bg-white/10 text-foreground",
                )}
              >
                {m.text}
                <span className="ml-2 text-[9px] opacity-60">
                  {new Date(m.time).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={send}
        className="sticky bottom-0 flex gap-2 border-t border-white/10 bg-background/90 p-3 backdrop-blur"
      >
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="h-11 border-white/10 bg-white/5"
        />
        <Button type="submit" size="icon" className="h-11 w-11 gradient-bg" aria-label="Enviar">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}