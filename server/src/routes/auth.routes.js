import { Router } from "express";
import { forgotPassword, login, logout, me, register, resetPassword, verifyOtp } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protect, me);
router.post("/verify-otp", protect, verifyOtp);
router.post("/logout", protect, logout);

export default router;
