// pages/api/socket.ts - Remove 'use server' directive
import { Server } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Fix: Remove 'use server' and add proper types
export default function handler(req: NextApiRequest, res: any & { socket: { server: { io?: Server } } }) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket_io",
      addTrailingSlash: false,
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);
      
      socket.on("join", (chatId: string) => {
        console.log(`Socket ${socket.id} joining room: ${chatId}`);
        socket.join(chatId);
      });
      
      // Fix: Add leave room functionality
      socket.on("leave", (chatId: string) => {
        console.log(`Socket ${socket.id} leaving room: ${chatId}`);
        socket.leave(chatId);
      });
      
      socket.on("send-message", (data: { chatId: string; message: any }) => {
        console.log(`Broadcasting message to room: ${data.chatId}`);
        // Fix: Use socket.to instead of io.to to avoid sending to sender
        socket.to(data.chatId).emit("new-message", data.message);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
    console.log("Socket.IO server initialized");
  }
  res.end();
}