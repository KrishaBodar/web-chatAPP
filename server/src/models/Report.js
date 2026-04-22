import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    message: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    reason: { type: String, required: true },
    status: { type: String, enum: ["open", "reviewing", "closed"], default: "open" }
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
