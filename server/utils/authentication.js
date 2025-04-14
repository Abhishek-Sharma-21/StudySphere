import jwt from "jsonwebtoken";

export const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Example: Token expires in 30 days
  });

  // Set token as an HTTP-only cookie (recommended for security)
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Send only over HTTPS in production
    sameSite: "strict", // Helps prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};
