import { Router } from "express";
import { assistant, polish, suggestions, summary, translateMessage } from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/:chatId/suggestions", suggestions);
router.get("/:chatId/summary", summary);
router.post("/polish", polish);
router.post("/translate", translateMessage);
router.post("/assistant", assistant);

export default router;
