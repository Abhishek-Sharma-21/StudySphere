import mongoose from "mongoose";

// Define the Like schema
const likeSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, // Reference to the Post that the like belongs to
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to the User who liked the post
  createdAt: { type: Date, default: Date.now }, // Timestamp when the like was created
});

// Unique index to prevent duplicate likes
likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

// Create the Like model
const Like = mongoose.model("Like", likeSchema);

export default Like;
