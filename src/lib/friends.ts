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

/**
 * La red de amigos arranca VACÍA: el usuario añade a sus amigos por código.
 * Estas semillas vacías existen para que use-friends.ts / use-chat.ts las usen
 * como punto de partida; la fuente de verdad es localStorage por-perfil.
 */
export const SEED_FRIENDS: Friend[] = [];

export const SEED_FRIEND_REQUESTS: FriendRequest[] = [];

export const SEED_CHATS: Record<string, ChatMessage[]> = {};

export const GROUPS: GroupRoom[] = [
  { id: "g1", name: "Sin alcohol — RD 🇩🇴", members: 124, topic: "Apoyo diario, sin juicios.", lastMessage: "Carlos: hoy cumplo 30 días 🥳" },
  { id: "g2", name: "Gamers en pausa", members: 67, topic: "Bajar horas frente a la pantalla.", lastMessage: "Ana: alguien para caminar el sábado?" },
  { id: "g3", name: "Noches sin scroll", members: 89, topic: "Dormir sin celular en la cama.", lastMessage: "Mod: nuevo reto publicado" },
];