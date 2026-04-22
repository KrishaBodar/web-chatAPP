import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function sendFriendRequest(req, res) {
  const target = await User.findOne({ username: req.body.username });
  if (!target) return res.status(404).json({ message: "User not found" });
  if (String(target._id) === String(req.user._id)) return res.status(400).json({ message: "You cannot add yourself" });

  const request = await FriendRequest.findOneAndUpdate(
    { from: req.user._id, to: target._id },
    { status: "pending" },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).populate("to", "name username avatar avatarGlow");

  res.status(201).json({ request });
}

export async function listFriendRequests(req, res) {
  const requests = await FriendRequest.find({
    $or: [{ from: req.user._id }, { to: req.user._id }]
  })
    .populate("from", "name username avatar avatarGlow")
    .populate("to", "name username avatar avatarGlow")
    .sort({ createdAt: -1 });
  res.json({ requests });
}

export async function respondFriendRequest(req, res) {
  const request = await FriendRequest.findOne({ _id: req.params.requestId, to: req.user._id });
  if (!request) return res.status(404).json({ message: "Request not found" });
  request.status = req.body.status === "accepted" ? "accepted" : "declined";
  await request.save();

  if (request.status === "accepted") {
    await User.updateOne({ _id: request.from }, { $addToSet: { friends: request.to } });
    await User.updateOne({ _id: request.to }, { $addToSet: { friends: request.from } });
  }

  res.json({ request });
}
