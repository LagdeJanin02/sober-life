export interface Friend {
  id: string;
  code: string;
  name: string;
  avatar: string;
  status: "online" | "offline";
  streak: number;
  lastMessage?: string;
}

export interface ChatMessage {
  id: string;
  from: "me" | string; // friend id or "me"
  text: string;
  time: string; // ISO
}

export interface FriendRequest {
  id: string;
  direction: "in" | "out";
  code: string;
  name: string;
  avatar: string;
}

export interface GroupRoom {
  id: string;
  name: string;
  members: number;
  topic: string;
  lastMessage: string;
}

const minsAgo = (n: number) => new Date(Date.now() - n * 60_000).toISOString();

export const FRIENDS: Friend[] = [
  { id: "f1", code: "SL-K9X7M2", name: "María C.", avatar: "🌷", status: "online", streak: 42, lastMessage: "¡Gracias por el ánimo de ayer! 💜" },
  { id: "f2", code: "SL-B3T8WQ", name: "Diego R.", avatar: "🌊", status: "online", streak: 18, lastMessage: "Voy a la junta del jueves, ¿vienes?" },
  { id: "f3", code: "SL-V5N2KP", name: "Luna A.", avatar: "🌙", status: "offline", streak: 7, lastMessage: "Buenas noches, mañana día 8 🎉" },
];

export const FRIEND_REQUESTS: FriendRequest[] = [
  { id: "r1", direction: "in", code: "SL-Q8M3X1", name: "Pedro M.", avatar: "⚓" },
  { id: "r2", direction: "out", code: "SL-J7P9LN", name: "Sofía V.", avatar: "🦋" },
];

export const CHATS: Record<string, ChatMessage[]> = {
  f1: [
    { id: "m1", from: "f1", text: "Hoy cumplo 42 días sin azúcar 🎉", time: minsAgo(120) },
    { id: "m2", from: "me", text: "¡Increíble! Eres mi inspiración 💪", time: minsAgo(115) },
    { id: "m3", from: "f1", text: "¡Gracias por el ánimo de ayer! 💜", time: minsAgo(30) },
  ],
  f2: [
    { id: "m1", from: "f2", text: "¿Cómo vas con el reto de la semana?", time: minsAgo(300) },
    { id: "m2", from: "me", text: "Vamos bien, registré los 7 días ✅", time: minsAgo(290) },
    { id: "m3", from: "f2", text: "Voy a la junta del jueves, ¿vienes?", time: minsAgo(60) },
  ],
  f3: [
    { id: "m1", from: "f3", text: "Hoy fue duro pero aquí seguimos", time: minsAgo(1000) },
    { id: "m2", from: "me", text: "Un día más es una victoria 🙌", time: minsAgo(990) },
    { id: "m3", from: "f3", text: "Buenas noches, mañana día 8 🎉", time: minsAgo(720) },
  ],
};

export const GROUPS: GroupRoom[] = [
  { id: "g1", name: "Sin alcohol — RD 🇩🇴", members: 124, topic: "Apoyo diario, sin juicios.", lastMessage: "Carlos: hoy cumplo 30 días 🥳" },
  { id: "g2", name: "Gamers en pausa", members: 67, topic: "Bajar horas frente a la pantalla.", lastMessage: "Ana: alguien para caminar el sábado?" },
  { id: "g3", name: "Noches sin scroll", members: 89, topic: "Dormir sin celular en la cama.", lastMessage: "Mod: nuevo reto publicado" },
];