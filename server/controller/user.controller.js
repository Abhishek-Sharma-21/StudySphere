import bcryptjs from "bcryptjs";
import crypto from "crypto";
import User from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateToken } from "../utils/authentication.js";
export const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields." });
  }
  try {
    const UserAlreadyExist = await User.findOne({ email });
    if (UserAlreadyExist) {
      return res.status(400).json({ message: "Email already in use." });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    const token = generateToken(res, user._id);
    return res.status(201).json({
      success: true,
      message: "User created Successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create user." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill in all fields." });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found." });
    }
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Credentials is Invalid" });
    }
    const token = generateToken(res, user._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to login user." });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Please Enter Your Email" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email." });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpires = resetTokenExpiresAt;
    await user.save();

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/reset-password/${resetToken}`;
    const message = `<p>You requested a password reset. Please click the following link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link will expire in 1 hour.</p><p>If you did not request this, please ignore this email.</p>`;

    const emailSent = await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });

    if (emailSent) {
      res.status(200).json({
        success: true,
        message: "Password reset email sent successfully.",
        resetToken: resetToken, // Include the token in the response if needed
      });
    } else {
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpires = undefined;
      await user.save(); // Clear the token if email sending fails
      res.status(500).json({ message: "Failed to send password reset email." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to process forgot password request." });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    return res
      .status(400)
      .json({ message: "Please provide a token and a new password." });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token." });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Failed to reset password." });
  }
};
