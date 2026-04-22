import { Router } from "express";
import { blockUser, searchUsers, unblockUser, updateProfile } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/search", searchUsers);
router.patch("/me", updateProfile);
router.post("/:userId/block", blockUser);
router.delete("/:userId/block", unblockUser);

export default router;
