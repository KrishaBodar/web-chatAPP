import jwt from "jsonwebtoken";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export function registerSocketHandlers(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Missing auth token"));
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id).select("name username avatar avatarGlow");
      if (!user) return next(new Error("Invalid user"));
      socket.user = user;
      next();
    } catch (error) {
      next(error);
    }
  });

  io.on("connection", async (socket) => {
    await User.findByIdAndUpdate(socket.user._id, { status: "online", lastSeenAt: new Date() });
    socket.broadcast.emit("presence:update", { userId: socket.user._id, status: "online" });

    socket.on("chat:join", async (chatId) => {
      const allowed = await Chat.exists({ _id: chatId, participants: socket.user._id });
      if (allowed) socket.join(String(chatId));
    });

    socket.on("chat:leave", (chatId) => {
      socket.leave(String(chatId));
    });

    socket.on("typing:start", ({ chatId }) => {
      socket.to(String(chatId)).emit("typing:start", { chatId, user: socket.user });
    });

    socket.on("typing:stop", ({ chatId }) => {
      socket.to(String(chatId)).emit("typing:stop", { chatId, userId: socket.user._id });
    });

    socket.on("message:deliver", async ({ chatId }) => {
      await Message.updateMany(
        { chat: chatId, deliveredTo: { $ne: socket.user._id } },
        { $addToSet: { deliveredTo: socket.user._id } }
      );
      socket.to(String(chatId)).emit("message:delivered", { chatId, userId: socket.user._id });
    });

    socket.on("disconnect", async () => {
      await User.findByIdAndUpdate(socket.user._id, { status: "offline", lastSeenAt: new Date() });
      socket.broadcast.emit("presence:update", { userId: socket.user._id, status: "offline", lastSeenAt: new Date() });
    });
  });
}
