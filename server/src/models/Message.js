import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["image", "video", "audio", "file"], default: "file" },
    name: String,
    url: String,
    size: Number
  },
  { _id: false }
);

const reactionSchema = new mongoose.Schema(
  {
    emoji: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, default: "" },
    kind: { type: String, enum: ["text", "voice", "media", "poll", "system"], default: "text" },
    attachments: [attachmentSchema],
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    reactions: [reactionSchema],
    deliveredTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    editedAt: Date,
    deletedAt: Date,
    pinned: { type: Boolean, default: false },
    scheduledFor: Date,
    expiresAt: Date
  },
  { timestamps: true }
);

messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ body: "text" });

export default mongoose.model("Message", messageSchema);
