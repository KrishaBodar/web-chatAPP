import User from "../models/User.js";

export async function searchUsers(req, res) {
  const q = req.query.q || "";
  const users = await User.find({
    _id: { $ne: req.user._id },
    $or: [
      { name: new RegExp(q, "i") },
      { username: new RegExp(q, "i") }
    ]
  })
    .select("name username avatar avatarGlow status lastSeenAt musicPresence")
    .limit(20);
  res.json({ users });
}

export async function updateProfile(req, res) {
  const allowed = ["name", "bio", "avatar", "avatarGlow", "musicPresence"];
  const update = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select("-passwordHash -otpCode");
  res.json({ user });
}

export async function blockUser(req, res) {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { blockedUsers: req.params.userId } },
    { new: true }
  ).select("-passwordHash -otpCode");
  res.json({ user });
}

export async function unblockUser(req, res) {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { blockedUsers: req.params.userId } },
    { new: true }
  ).select("-passwordHash -otpCode");
  res.json({ user });
}
