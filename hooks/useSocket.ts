// hooks/useSocket.ts
'use client'
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

export function useSocket() {
  const socketRef = useRef<typeof Socket | null>(null);
  const [socket, setSocket] = useState<typeof Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      const newSocket = io({
        path: "/api/socket_io",
        transports: ["websocket"],
        reconnection: true,
      });

      newSocket.on("connect", () => {
        console.log("Connected to socket");
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from socket");
      });

      socketRef.current = newSocket;
      setSocket(newSocket);
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return socket;
}
