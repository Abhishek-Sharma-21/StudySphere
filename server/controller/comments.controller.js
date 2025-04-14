import Comment from "../models/comment.model.js";

export const AddComment = async (req, res) => {
  const { content, postId } = req.body;
  const creatorId = req.user?.id;
  if (!creatorId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!content || !postId) {
    return res.status(400).json({ message: "Content and postId is required" });
  }
  try {
    const comment = await Comment.create({
      content,
      postId,
      creator: creatorId,
    });
    const populatedComment = await Comment.findById(comment._id).populate(
      "creator",
      "name email"
    );
    console.log(populatedComment);
    return res.status(201).json(populatedComment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to add comment" });
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
    console.log("check debug", comment.creator.toString());
    console.log("crator id", creatorId);

    if (comment.creator.toString() !== creatorId.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to edit this comment" });
    }

    comment.content = content; // Correct field name
    await comment.save();

    return res.status(200).json(comment);
  } catch (error) {
    console.log(error);
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

    // Check if the user deleting is the creator
    if (comment.creator.toString() !== creatorId.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this comment" });
    }

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to delete comment" });
  }
};
