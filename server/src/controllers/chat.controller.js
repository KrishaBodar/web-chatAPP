import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import Report from "../models/Report.js";
import { detectMood } from "../utils/ai.js";

const chatPopulate = [
  { path: "participants", select: "name username avatar avatarGlow status lastSeenAt musicPresence" },
  { path: "lastMessage" }
];

export async function listChats(req, res) {
  const chats = await Chat.find({ participants: req.user._id })
    .populate(chatPopulate)
    .sort({ updatedAt: -1 });
  res.json({ chats });
}

export async function getChat(req, res) {
  const chat = await Chat.findOne({ _id: req.params.chatId, participants: req.user._id }).populate(chatPopulate);
  if (!chat) return res.status(404).json({ message: "Chat not found" });
  res.json({ chat });
}

export async function createChat(req, res) {
  const { participantIds = [], name, type = "direct" } = req.body;
  const participants = [...new Set([String(req.user._id), ...participantIds])];
  const chat = await Chat.create({
    name,
    type,
    participants,
    admins: [req.user._id]
  });
  await chat.populate(chatPopulate);
  res.status(201).json({ chat });
}

export async function getMessages(req, res) {
  const messages = await Message.find({
    chat: req.params.chatId,
    $or: [{ scheduledFor: { $exists: false } }, { scheduledFor: null }],
    deletedAt: null
  })
    .populate("sender", "name username avatar avatarGlow")
    .populate("replyTo")
    .sort({ createdAt: 1 })
    .limit(100);
  res.json({ messages });
}

export async function sendMessage(req, res) {
  const { body, kind = "text", attachments = [], replyTo, scheduledFor, expiresInSeconds } = req.body;
  const chat = await Chat.findOne({ _id: req.params.chatId, participants: req.user._id });
  if (!chat) return res.status(404).json({ message: "Chat not found" });

  const message = await Message.create({
    chat: chat._id,
    sender: req.user._id,
    body,
    kind,
    attachments,
    replyTo,
    scheduledFor,
    expiresAt: expiresInSeconds ? new Date(Date.now() + Number(expiresInSeconds) * 1000) : undefined,
    deliveredTo: [req.user._id],
    seenBy: [req.user._id]
  });

  if (!scheduledFor) {
    chat.lastMessage = message._id;
    const recent = await Message.find({ chat: chat._id, deletedAt: null }).sort({ createdAt: -1 }).limit(20);
    chat.mood = detectMood(recent.reverse());
    await chat.save();
    req.app.get("io").to(String(chat._id)).emit("message:new", await message.populate("sender", "name username avatar avatarGlow"));
  }

  res.status(201).json({ message });
}

export async function updateMessage(req, res) {
  const message = await Message.findOne({ _id: req.params.messageId, sender: req.user._id });
  if (!message) return res.status(404).json({ message: "Message not found" });
  message.body = req.body.body;
  message.editedAt = new Date();
  await message.save();
  req.app.get("io").to(String(message.chat)).emit("message:update", message);
  res.json({ message });
}

export async function deleteMessage(req, res) {
  const message = await Message.findOne({ _id: req.params.messageId, sender: req.user._id });
  if (!message) return res.status(404).json({ message: "Message not found" });
  message.deletedAt = new Date();
  await message.save();
  req.app.get("io").to(String(message.chat)).emit("message:delete", { messageId: message._id });
  res.json({ ok: true });
}

export async function reactToMessage(req, res) {
  const message = await Message.findById(req.params.messageId);
  if (!message) return res.status(404).json({ message: "Message not found" });
  message.reactions = message.reactions.filter((reaction) => String(reaction.user) !== String(req.user._id));
  if (req.body.emoji) message.reactions.push({ emoji: req.body.emoji, user: req.user._id });
  await message.save();
  req.app.get("io").to(String(message.chat)).emit("message:reaction", message);
  res.json({ message });
}

export async function markSeen(req, res) {
  await Message.updateMany(
    { chat: req.params.chatId, seenBy: { $ne: req.user._id } },
    { $addToSet: { seenBy: req.user._id } }
  );
  req.app.get("io").to(String(req.params.chatId)).emit("message:seen", { chatId: req.params.chatId, userId: req.user._id });
  res.json({ ok: true });
}

export async function searchMessages(req, res) {
  const messages = await Message.find({
    chat: req.params.chatId,
    deletedAt: null,
    $text: { $search: req.query.q || "" }
  }).limit(30);
  res.json({ messages });
}

export async function togglePinChat(req, res) {
  const chat = await Chat.findOne({ _id: req.params.chatId, participants: req.user._id });
  if (!chat) return res.status(404).json({ message: "Chat not found" });
  const isPinned = chat.pinnedBy.some((id) => String(id) === String(req.user._id));
  chat.pinnedBy = isPinned ? chat.pinnedBy.filter((id) => String(id) !== String(req.user._id)) : [...chat.pinnedBy, req.user._id];
  await chat.save();
  res.json({ chat });
}

export async function createPoll(req, res) {
  const chat = await Chat.findOne({ _id: req.params.chatId, participants: req.user._id });
  if (!chat) return res.status(404).json({ message: "Chat not found" });
  chat.polls.push({
    question: req.body.question,
    options: (req.body.options || []).map((label) => ({ label, votes: [] }))
  });
  await chat.save();
  req.app.get("io").to(String(chat._id)).emit("poll:new", chat.polls.at(-1));
  res.status(201).json({ poll: chat.polls.at(-1) });
}

export async function reportChat(req, res) {
  const report = await Report.create({
    reporter: req.user._id,
    chat: req.params.chatId,
    reportedUser: req.body.reportedUser,
    message: req.body.messageId,
    reason: req.body.reason
  });
  res.status(201).json({ report });
}
