import mongoose from "mongoose";

const pollSchema = new mongoose.Schema(
  {
    question: String,
    options: [
      {
        label: String,
        votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
      }
    ]
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema(
  {
    name: String,
    type: { type: String, enum: ["direct", "group", "assistant"], default: "direct" },
    mood: { type: String, default: "cosmic" },
    wallpaper: { type: String, default: "aurora" },
    secretMode: { type: Boolean, default: false },
    focusMode: { type: Boolean, default: false },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    pinnedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    polls: [pollSchema],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
