import express from "express";
import { forgotPassword, loginUser, logoutUser, profile, registerUser, resetPassword, verifyUser } from "../controller/index.controller.js";
import { auth } from "../middleware/index.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify/:token", verifyUser);
router.post("/login", loginUser);
router.get("/profile", auth, profile);
router.get("/logout", auth, logoutUser);
router.post("/forgotPassword", auth, forgotPassword);
router.post("/resetPassword/:token", auth, resetPassword);

export default router;