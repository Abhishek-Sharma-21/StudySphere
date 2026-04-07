import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config(); // Load environment variables

const secretKey = process.env.JWT_SECRET; // 🔥 Now using your real JWT_SECRET

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, secretKey);

    const user = await User.findById(decoded.userId).select("-password"); // Fetch user without password
    // console.log(user);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = { id: user._id }; // Attach user id to request
    next(); // Continue to controller
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
