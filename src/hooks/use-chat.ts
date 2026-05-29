import * as React from "react";
import { profileKey } from "@/lib/auth";
import { SEED_CHATS, type ChatMessage } from "@/lib/friends";

const EVENT = "soberlife:chat";

function storageKey(friendId: string) {
  return profileKey(`chat2:${friendId}`);
}

function load(friendId: string): ChatMessage[] {
  if (typeof window === "undefined") return SEED_CHATS[friendId] ?? [];
  try {
    const raw = localStorage.getItem(storageKey(friendId));
    if (raw === null) {
      const seed = SEED_CHATS[friendId] ?? [];
      localStorage.setItem(storageKey(friendId), JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as ChatMessage[];
  } catch {
    return SEED_CHATS[friendId] ?? [];
  }
}

function save(friendId: string, list: ChatMessage[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(friendId), JSON.stringify(list));
  window.dispatchEvent(new Event(EVENT));
}

export function useChat(friendId: string) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const refresh = () => setMessages(load(friendId));
    refresh();
    setReady(true);
    window.addEventListener(EVENT, refresh);
    window.addEventListener("soberlife:profile-change", refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("soberlife:profile-change", refresh);
    };
  }, [friendId]);

  /** Envía un mensaje propio (persistido) y agenda una respuesta simulada del amigo. */
  const send = React.useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const me: ChatMessage = {
        id: crypto.randomUUID(),
        from: "me",
        text: trimmed,
        time: new Date().toISOString(),
      };
      save(friendId, [...load(friendId), me]);
      // Respuesta simulada (sin servidor real).
      setTimeout(() => {
        const reply: ChatMessage = {
          id: crypto.randomUUID(),
          from: friendId,
          text: "¡Te entiendo! Aquí estamos 💜",
          time: new Date().toISOString(),
        };
        save(friendId, [...load(friendId), reply]);
      }, 1200);
    },
    [friendId],
  );

  return { messages, ready, send };
}
