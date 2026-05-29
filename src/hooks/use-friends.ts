import * as React from "react";
import { profileKey } from "@/lib/auth";
import {
  SEED_FRIENDS,
  SEED_FRIEND_REQUESTS,
  type Friend,
  type FriendRequest,
} from "@/lib/friends";

const EVENT = "soberlife:friends";
const FRIEND_CODE_RE = /^SL-[A-Z0-9]{6}$/i;
const AVATARS = ["🌷", "🌊", "🌙", "🔥", "🦋", "⚓", "🌱", "⭐", "🎯", "🧘", "🦁", "💜"];

// Claves versionadas: la red de amigos arranca vacía y no arrastra datos de versiones previas.
const K_FRIENDS = "friends_v2";
const K_REQUESTS = "friend_requests_v2";
const K_GROUPS = "groups_v2";

function loadSeeded<T>(key: string, seed: T[]): T[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(profileKey(key));
    if (raw === null) {
      localStorage.setItem(profileKey(key), JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as T[];
  } catch {
    return seed;
  }
}

function loadFriends(): Friend[] {
  return loadSeeded(K_FRIENDS, SEED_FRIENDS);
}
function loadRequests(): FriendRequest[] {
  return loadSeeded(K_REQUESTS, SEED_FRIEND_REQUESTS);
}
function loadGroups(): string[] {
  return loadSeeded<string>(K_GROUPS, []);
}

function saveFriends(list: Friend[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(profileKey(K_FRIENDS), JSON.stringify(list));
  window.dispatchEvent(new Event(EVENT));
}
function saveRequests(list: FriendRequest[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(profileKey(K_REQUESTS), JSON.stringify(list));
  window.dispatchEvent(new Event(EVENT));
}
function saveGroups(list: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(profileKey(K_GROUPS), JSON.stringify(list));
  window.dispatchEvent(new Event(EVENT));
}

export function useFriends() {
  const [friends, setFriends] = React.useState<Friend[]>(SEED_FRIENDS);
  const [requests, setRequests] = React.useState<FriendRequest[]>(SEED_FRIEND_REQUESTS);
  const [groups, setGroups] = React.useState<string[]>([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const refresh = () => {
      setFriends(loadFriends());
      setRequests(loadRequests());
      setGroups(loadGroups());
    };
    refresh();
    setReady(true);
    window.addEventListener(EVENT, refresh);
    window.addEventListener("soberlife:profile-change", refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("soberlife:profile-change", refresh);
    };
  }, []);

  /** Añade un amigo por código: valida formato, evita duplicados y crea una solicitud saliente. */
  const addByCode = React.useCallback(
    (rawCode: string): { ok: boolean; error?: string } => {
      const code = rawCode.trim().toUpperCase();
      if (!FRIEND_CODE_RE.test(code)) {
        return { ok: false, error: "Código inválido. Usa el formato SL-XXXXXX." };
      }
      const reqs = loadRequests();
      const fr = loadFriends();
      if (fr.some((f) => f.code.toUpperCase() === code)) {
        return { ok: false, error: "Ya es tu amigo." };
      }
      if (reqs.some((r) => r.code.toUpperCase() === code)) {
        return { ok: false, error: "Ya hay una solicitud con ese código." };
      }
      const avatar = AVATARS[code.charCodeAt(3) % AVATARS.length];
      const next: FriendRequest = {
        id: crypto.randomUUID(),
        direction: "out",
        code,
        name: code, // sin servidor no conocemos el nombre real todavía
        avatar,
      };
      saveRequests([...reqs, next]);
      return { ok: true };
    },
    [],
  );

  /** Acepta una solicitud entrante: la convierte en amigo y la quita de solicitudes. */
  const acceptRequest = React.useCallback((id: string) => {
    const reqs = loadRequests();
    const req = reqs.find((r) => r.id === id);
    if (!req) return;
    const friend: Friend = {
      id: crypto.randomUUID(),
      code: req.code,
      name: req.name,
      avatar: req.avatar,
      status: "online",
      streak: 1,
      lastMessage: "¡Ahora son amigos! Salúdalo 👋",
    };
    saveFriends([...loadFriends(), friend]);
    saveRequests(reqs.filter((r) => r.id !== id));
  }, []);

  /** Rechaza/cancela una solicitud. */
  const rejectRequest = React.useCallback((id: string) => {
    saveRequests(loadRequests().filter((r) => r.id !== id));
  }, []);

  /** Unirse a una sala grupal (persistido). Devuelve false si ya estaba unido. */
  const joinGroup = React.useCallback((groupId: string): boolean => {
    const list = loadGroups();
    if (list.includes(groupId)) return false;
    saveGroups([...list, groupId]);
    return true;
  }, []);

  /** Salir de una sala grupal. */
  const leaveGroup = React.useCallback((groupId: string) => {
    saveGroups(loadGroups().filter((g) => g !== groupId));
  }, []);

  const isInGroup = React.useCallback(
    (groupId: string) => groups.includes(groupId),
    [groups],
  );

  return {
    friends,
    requests,
    groups,
    ready,
    addByCode,
    acceptRequest,
    rejectRequest,
    joinGroup,
    leaveGroup,
    isInGroup,
  };
}
