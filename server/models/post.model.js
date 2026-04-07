import mongoose from "mongoose";

// Define the Post schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  longDescription: { type: String },
  url: { type: String, match: /^https?:\/\/\S+$/ }, // Optional URL, must be a valid URL if provided
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Array of references to Comment models
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of references to User models who liked the post
  category: {
    type: String,
    enum: ["community", "discussion"],
    default: "community",
  }, // Category to distinguish between community posts and discussions
  createdAt: { type: Date, default: Date.now },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to User (creator)
});

// Create the Post model
const Post = mongoose.model("Post", postSchema);

export default Post;
