import express from "express";
import { authMiddleware } from "../middlewares/CheckAuthenication.js";
import {
  AddComment,
  deleteComment,
  updateComment,
  getCommentsByPost,
} from "../controller/comments.controller.js";

const router = express.Router();

router.get("/comments/:postId", getCommentsByPost);
router.post("/comment", authMiddleware, AddComment);
router.post("/update-comment/:commentId", authMiddleware, updateComment);
router.delete("/delete-comment/:commentId", authMiddleware, deleteComment);
export default router;
