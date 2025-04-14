import mongoose from "mongoose";

// Define the Comment schema
const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, // Reference to the Post that the comment belongs to
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to User (creator)
});

// Create the Comment model
const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
