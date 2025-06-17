// app/api/socket/route.ts
import { Server } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: any, res: any) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket_io",
      addTrailingSlash: false,
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);
      socket.on("join", (chatId) => {
        socket.join(chatId);
      });

      socket.on("send-message", (data) => {
        io.to(data.chatId).emit("new-message", data.message);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
