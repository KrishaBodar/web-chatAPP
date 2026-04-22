import { Router } from "express";
import { listFriendRequests, respondFriendRequest, sendFriendRequest } from "../controllers/friend.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/requests", listFriendRequests);
router.post("/requests", sendFriendRequest);
router.patch("/requests/:requestId", respondFriendRequest);

export default router;
