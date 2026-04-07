import Like from "../models/like.model.js";
import Post from "../models/post.model.js";
import { getIO } from "../socket/socket.js";

export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user?.id;

    if (!postId || !userId) {
      return res.status(400).json({ message: "PostId and UserId are required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Initialize likes if not present (defensive)
    if (!post.likes) post.likes = [];

    const existingLike = await Like.findOne({ postId, userId });
    const io = getIO();

    if (existingLike) {
      // Unlike logic
      await Like.findByIdAndDelete(existingLike._id);
      // Remove userId from post.likes array
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
      await post.save();

      // Socket: Broadcast state change
      io.emit("post_liked", { postId, likes: post.likes, userId, action: "unlike" });

      return res.status(200).json({
        message: "Post unliked successfully",
        postId,
        likes: post.likes,
      });
    } else {
      // Like logic
      const like = new Like({ postId, userId });
      await like.save();
      // Add userId to post.likes array (if not already present)
      if (!post.likes.some((id) => id.toString() === userId.toString())) {
        post.likes.push(userId);
      }
      await post.save();

      // Socket: Broadcast state change
      io.emit("post_liked", { postId, likes: post.likes, userId, action: "like" });

      return res.status(200).json({
        message: "Post liked successfully",
        postId,
        likes: post.likes,
      });
    }

  } catch (error) {
    console.error("ToggleLike Error:", error);
    res.status(500).json({ message: "Something went wrong.", error: error.message });
  }
};
