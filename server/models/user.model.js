import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String }, // Token for password reset
    resetPasswordTokenExpires: { type: Date }, // Expiry time for the token
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
