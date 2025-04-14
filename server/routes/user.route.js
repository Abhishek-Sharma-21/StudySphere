import express from "express";
import {
  forgotPassword,
  login,
  logout,
  resetPassword,
  signUp,
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/auth/sign-up", signUp);
router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
