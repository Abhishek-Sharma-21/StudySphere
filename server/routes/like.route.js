import express from "express";
import { toggleLike } from "../controller/likes.controller.js";
import { authMiddleware } from "../middlewares/CheckAuthenication.js";

const router = express.Router();

// Toggle Like (click like button)
router.post("/posts/like", authMiddleware, toggleLike);

export default router;
