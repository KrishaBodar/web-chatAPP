import { Router } from "express";
import {
  createChat,
  createPoll,
  deleteMessage,
  getChat,
  getMessages,
  listChats,
  markSeen,
  reactToMessage,
  reportChat,
  searchMessages,
  sendMessage,
  togglePinChat,
  updateMessage
} from "../controllers/chat.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/", listChats);
router.post("/", createChat);
router.get("/:chatId", getChat);
router.get("/:chatId/messages", getMessages);
router.post("/:chatId/messages", sendMessage);
router.get("/:chatId/search", searchMessages);
router.post("/:chatId/seen", markSeen);
router.post("/:chatId/pin", togglePinChat);
router.post("/:chatId/polls", createPoll);
router.post("/:chatId/report", reportChat);
router.patch("/messages/:messageId", updateMessage);
router.delete("/messages/:messageId", deleteMessage);
router.post("/messages/:messageId/reactions", reactToMessage);

export default router;
