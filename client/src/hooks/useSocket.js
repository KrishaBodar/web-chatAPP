import { useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { API_URL } from "../lib/api.js";

export function useSocket(token) {
  const socket = useMemo(() => {
    if (!token) return null;
    return io(API_URL, { auth: { token }, autoConnect: true });
  }, [token]);

  useEffect(() => () => socket?.disconnect(), [socket]);

  return socket;
}
