import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import { safeUser, signToken } from "../utils/tokens.js";

export async function register(req, res) {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: "Name, username, email, and password are required" });
  }

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) return res.status(409).json({ message: "Email or username already exists" });

  const passwordHash = await bcrypt.hash(password, 12);
  const otpCode = String(Math.floor(100000 + Math.random() * 900000));
  const user = await User.create({
    name,
    username,
    email,
    passwordHash,
    otpCode,
    otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    sessions: [{ device: req.headers["user-agent"], ip: req.ip, lastActiveAt: new Date() }]
  });

  res.status(201).json({ user: safeUser(user), token: signToken(user), otpPreview: otpCode });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  user.sessions.push({ device: req.headers["user-agent"], ip: req.ip, lastActiveAt: new Date() });
  user.status = "online";
  await user.save();
  res.json({ user: safeUser(user), token: signToken(user) });
}

export async function me(req, res) {
  res.json({ user: req.user });
}

export async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "If an account exists, a reset code has been generated." });
  }

  const rawToken = crypto.randomBytes(24).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  user.resetPasswordExpiresAt = new Date(Date.now() + 20 * 60 * 1000);
  await user.save();

  res.json({
    message: "Password reset token generated. Connect an email provider before production launch.",
    resetTokenPreview: rawToken
  });
}

export async function resetPassword(req, res) {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token || "").digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiresAt: { $gt: new Date() }
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });

  user.passwordHash = await bcrypt.hash(password, 12);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();

  res.json({ message: "Password reset complete" });
}

export async function verifyOtp(req, res) {
  const { code } = req.body;
  const user = await User.findById(req.user._id);
  if (!user.otpCode || user.otpCode !== code || user.otpExpiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }
  user.verified = true;
  user.otpCode = undefined;
  user.otpExpiresAt = undefined;
  await user.save();
  res.json({ user: safeUser(user) });
}

export async function logout(req, res) {
  await User.findByIdAndUpdate(req.user._id, { status: "offline", lastSeenAt: new Date() });
  res.json({ ok: true });
}
