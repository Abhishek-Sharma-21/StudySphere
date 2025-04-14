import Like from "../models/like.model.js";

export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user?.id; // Assuming user info comes from auth middleware

    // Check if the like already exists
    const existingLike = await Like.findOne({ postId, userId });

    if (existingLike) {
      // If exists, remove (unlike)
      await Like.findByIdAndDelete(existingLike._id);
      return res.status(200).json({ message: "Post unliked successfully." });
    } else {
      // If not exists, create (like)
      const like = new Like({ postId, userId });
      await like.save();
      // Populate the user info
      const populatedLike = await Like.findById(like._id).populate(
        "userId",
        "name email"
      );
      // Only populate 'name' and 'email' from user

      return res.status(201).json({
        message: "Post liked successfully.",
        like: populatedLike,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};
