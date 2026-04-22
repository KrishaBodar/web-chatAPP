import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

export function startScheduler(io) {
  setInterval(async () => {
    const dueMessages = await Message.find({
      scheduledFor: { $lte: new Date() },
      deletedAt: null
    }).populate("sender", "name username avatar avatarGlow");

    await Promise.all(
      dueMessages.map(async (message) => {
        message.scheduledFor = undefined;
        await message.save();
        await Chat.findByIdAndUpdate(message.chat, { lastMessage: message._id });
        io.to(String(message.chat)).emit("message:new", message);
      })
    );
  }, 30000);
}
