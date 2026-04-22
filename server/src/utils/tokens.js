import jwt from "jsonwebtoken";

export function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
}

export function safeUser(user) {
  const data = user.toObject ? user.toObject() : user;
  delete data.passwordHash;
  delete data.otpCode;
  return data;
}
