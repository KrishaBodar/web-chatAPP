import Message from "../models/Message.js";
import { assistantReply, buildSuggestions, emojiSuggestions, grammarFix, summarize, translate } from "../utils/ai.js";

export async function suggestions(req, res) {
  const messages = await Message.find({ chat: req.params.chatId, deletedAt: null }).sort({ createdAt: 1 }).limit(20);
  res.json({ suggestions: buildSuggestions(messages), emojis: emojiSuggestions(messages.at(-1)?.body) });
}

export async function summary(req, res) {
  const messages = await Message.find({ chat: req.params.chatId, deletedAt: null }).sort({ createdAt: -1 }).limit(50);
  res.json({ summary: summarize(messages.reverse()) });
}

export async function polish(req, res) {
  res.json({ text: grammarFix(req.body.text) });
}

export async function translateMessage(req, res) {
  res.json({ text: translate(req.body.text, req.body.language) });
}

export async function assistant(req, res) {
  res.json({ reply: assistantReply(req.body.prompt) });
}
