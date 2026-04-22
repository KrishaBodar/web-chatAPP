import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    device: String,
    ip: String,
    lastActiveAt: Date
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatar: String,
    avatarGlow: { type: String, default: "violet" },
    bio: { type: String, default: "Living in the LUMORA glow." },
    musicPresence: {
      title: String,
      artist: String,
      artwork: String
    },
    status: { type: String, enum: ["online", "offline", "idle", "dnd"], default: "offline" },
    lastSeenAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
    otpCode: String,
    otpExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    sessions: [sessionSchema]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
