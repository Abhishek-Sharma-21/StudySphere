import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import { getIO } from "../socket/socket.js";

export const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;
  if (!postId) {
    return res.status(400).json({ message: "postId is required" });
  }
  try {
    const comments = await Comment.find({ postId })
      .sort({ createdAt: 1 })
      .populate("creator", "name email");
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch comments" });
  }
};

export const AddComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const creatorId = req.user?.id;

    console.log("AddComment Request:", { content, postId, creatorId });

    if (!creatorId) {
      return res.status(401).json({ message: "Unauthorized: Missing user ID" });
    }
    if (!content || !postId) {
      return res.status(400).json({ message: "Content and postId are required" });
    }

    // 1. Create the comment
    const comment = await Comment.create({
      content,
      postId,
      creator: creatorId,
    });

    // 2. Update the Post model's comment array
    const post = await Post.findById(postId);
    if (post) {
      if (!post.comments) post.comments = [];
      post.comments.push(comment._id);
      await post.save();
    } else {
      console.warn("AddComment: Post not found to update comments array", postId);
    }

    // 3. Return populated comment
    const populatedComment = await Comment.findById(comment._id).populate(
      "creator",
      "name email"
    );
    
    // Socket: Broadcast new comment to all nodes
    const io = getIO();
    io.emit("new_comment", populatedComment);

    return res.status(201).json(populatedComment);

  } catch (error) {
    console.error("AddComment Error:", error);
    return res.status(500).json({ message: "Failed to add comment", error: error.message });
  }
};

export const updateComment = async (req, res) => {
  const { content } = req.body;
  const { commentId } = req.params;
  const creatorId = req.user?.id;

  if (!creatorId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }
  if (!commentId) {
    return res.status(400).json({ message: "CommentId is required" });
  }

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.creator.toString() !== creatorId.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to edit this comment" });
    }

    comment.content = content;
    await comment.save();

    return res.status(200).json(comment);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update comment" });
  }
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const creatorId = req.user?.id;

  if (!creatorId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.creator.toString() !== creatorId.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this comment" });
    }

    // Also remove from Post's comment array
    const post = await Post.findById(comment.postId);
    if (post) {
      post.comments = post.comments.filter(id => id.toString() !== commentId);
      await post.save();
    }

    await Comment.findByIdAndDelete(commentId);

    // Socket: Broadcast deletion to all nodes
    const io = getIO();
    io.emit("delete_comment", { commentId, postId: comment.postId });

    return res.status(200).json({ message: "Comment deleted successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Failed to delete comment" });
  }
};
