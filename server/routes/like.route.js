import express from "express";
import { toggleLike } from "../controller/likes.controller.js";
import { getLikedPosts } from "../controller/posts.controller.js";
import { authMiddleware } from "../middlewares/CheckAuthenication.js";

const router = express.Router();

// Toggle Like (click like button)
router.post("/posts/like", authMiddleware, toggleLike);

// Get all liked posts of the current user
router.get("/posts/liked", authMiddleware, getLikedPosts);

export default router;
