import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import Like from "../models/like.model.js";

export const createPost = async (req, res) => {
  const { title, shortDescription, longDescription, url } = req.body;
  const creatorId = req.user?.id; // Assuming you have user ID in req.user after authentication
  console.log(creatorId);
  if (!creatorId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!title || !shortDescription) {
    return res
      .status(400)
      .json({ message: "Title and short description are required." });
  }
  try {
    const post = await Post.create({
      title,
      shortDescription,
      longDescription,
      url,
      creator: creatorId, // Use the authenticated user's ID
    });
    // Retrieve the post from the database and populate the creator field
    const populatedPost = await Post.findById(post._id).populate(
      "creator",
      "name email"
    );
    console.log(populatedPost);
    res.status(201).json(populatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("creator", "name email");
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id).populate("creator", "name email");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, shortDescription, longDescription, url } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        title,
        shortDescription,
        longDescription,
        url,
      },
      { new: true }
    ).populate("creator", "name email");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid Post ID" });

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // If you have comments linked to post
    await Comment.deleteMany({ _id: { $in: post.comments } });
    await Like.deleteMany({ postId: id });

    await Post.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "Post and related comments deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
