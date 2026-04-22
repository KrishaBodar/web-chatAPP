const toneWords = {
  happy: ["amazing", "love", "great", "yes", "wow", "perfect"],
  focused: ["ship", "plan", "review", "deadline", "clean", "priority"],
  calm: ["fine", "gentle", "quiet", "sure", "steady"],
  intense: ["urgent", "now", "issue", "blocked", "critical"]
};

export function detectMood(messages = []) {
  const text = messages.map((message) => message.body || "").join(" ").toLowerCase();
  const scores = Object.entries(toneWords).map(([mood, words]) => [
    mood,
    words.reduce((score, word) => score + (text.includes(word) ? 1 : 0), 0)
  ]);
  return scores.sort((a, b) => b[1] - a[1])[0]?.[1] > 0 ? scores[0][0] : "cosmic";
}

export function buildSuggestions(messages = []) {
  const latest = messages.at(-1)?.body || "";
  if (latest.includes("?")) {
    return ["Absolutely, let me think about it.", "I can do that. Give me a moment.", "Great question. Here is my take:"];
  }
  return ["That sounds beautiful.", "I am with you.", "Let's make it happen."];
}

export function emojiSuggestions(text = "") {
  const lower = text.toLowerCase();
  if (lower.includes("love") || lower.includes("wow")) return ["✨", "💜", "😍"];
  if (lower.includes("ship") || lower.includes("done")) return ["🚀", "✅", "🔥"];
  if (lower.includes("sad") || lower.includes("sorry")) return ["🫶", "💙", "🌙"];
  return ["✨", "😊", "💬"];
}

export function summarize(messages = []) {
  const important = messages
    .filter((message) => (message.body || "").length > 8)
    .slice(-8)
    .map((message) => message.body);
  return important.length
    ? `Recent thread focus: ${important.join(" ")}`
    : "No substantial messages yet. The chat is ready for its first spark.";
}

export function grammarFix(text = "") {
  const trimmed = text.trim();
  if (!trimmed) return "";
  const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return /[.!?]$/.test(capitalized) ? capitalized : `${capitalized}.`;
}

export function translate(text = "", language = "Spanish") {
  return `[${language}] ${text}`;
}

export function assistantReply(prompt = "") {
  return `LUMORA Assistant: I can help draft a refined reply, summarize the room, or turn "${prompt}" into a warmer message.`;
}
