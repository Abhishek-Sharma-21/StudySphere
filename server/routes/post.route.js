import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
  getLikedPosts,
} from "../controller/posts.controller.js";
import { authMiddleware } from "../middlewares/CheckAuthenication.js";
const router = express.Router();

router.post("/posts/create", authMiddleware, createPost);
router.get("/posts", getAllPosts);
router.get("/posts/liked", authMiddleware, getLikedPosts);
router.get("/posts/:id", getPostById);
router.put("/posts/update/:id", authMiddleware, updatePost);
router.delete("/posts/delete/:id", authMiddleware, deletePost);

export default router;
