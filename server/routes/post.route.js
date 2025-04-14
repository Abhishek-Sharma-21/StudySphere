import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from "../controller/posts.controller.js";
import { authMiddleware } from "../middlewares/CheckAuthenication.js";
const router = express.Router();

router.post("/posts/create", authMiddleware, createPost);
router.get("/posts", authMiddleware, getAllPosts);
router.get("/posts/:id", authMiddleware, getPostById);
router.post("/posts/update/:id", authMiddleware, updatePost);
router.delete("/posts/delete/:id", authMiddleware, deletePost);
export default router;
