import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import Like from "../models/like.model.js";
import { getIO } from "../socket/socket.js";

export const createPost = async (req, res) => {
  const { title, shortDescription, longDescription, url, category } = req.body;
  const creatorId = req.user?.id;
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
      category: category || "community",
      creator: creatorId,
    });
    const populatedPost = await Post.findById(post._id).populate(
      "creator",
      "name email"
    );

    // Socket: Broadcast new post to all connected nodes
    const io = getIO();
    io.emit("new_post", populatedPost);

    res.status(201).json(populatedPost);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const skip = (page - 1) * limit;

    const filter = category ? { category } : {};
    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate("creator", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
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
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, shortDescription, longDescription, url } = req.body;
  const userId = req.user?.id;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (String(post.creator) !== String(req.user?.id)) {
      return res.status(403).json({ message: "Unauthorized to update this post" });
    }

    post.title = title || post.title;
    post.shortDescription = shortDescription || post.shortDescription;
    post.longDescription = longDescription || post.longDescription;
    post.url = url || post.url;

    await post.save();
    
    const updatedPost = await Post.findById(id).populate("creator", "name email transition");
    res.status(200).json(updatedPost);
  } catch (error) {
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

    if (String(post.creator) !== String(req.user?.id)) {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }


    await Comment.deleteMany({ _id: { $in: post.comments } });
    await Like.deleteMany({ postId: id });

    await Post.findByIdAndDelete(id);

    // Socket: Broadcast post deletion to all nodes
    const io = getIO();
    io.emit("delete_post", { postId: id });

    res
      .status(200)
      .json({ message: "Post and related comments deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getLikedPosts = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const posts = await Post.find({ likes: userId }).populate(
      "creator",
      "name email"
    );
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
