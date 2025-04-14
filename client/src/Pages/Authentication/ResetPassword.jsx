import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../features/authSlice";
import { LoginPage } from "../../components/RouteNames/RouteName";
import { Loader } from "lucide-react";

const ResetPasswordUI = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isError, errorMessage } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const body = {
      password,
      token,
    };
    try {
      const result = await dispatch(resetPassword(body));
      if (result?.payload?.success) {
        console.log("Password reset successful!");
        navigate(LoginPage); // Redirect to login page after success
      } else {
        console.log(result?.payload?.message || "Password reset failed");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-zinc-400 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-8 w-full max-w-md text-white">
        <h2 className="text-3xl font-bold text-center mb-6">
          Reset Your Password
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Password Field */}
          <div className="flex items-center border border-white/20 rounded-lg px-3 py-2">
            <FaLock className="text-zinc-300 mr-3" />
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent outline-none w-full text-white placeholder-zinc-400"
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div className="flex items-center border border-white/20 rounded-lg px-3 py-2">
            <FaLock className="text-zinc-300 mr-3" />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-transparent outline-none w-full text-white placeholder-zinc-400"
              required
            />
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
        {isError && (
          <div className="bg-red-100 text-center text-red-700 mt-4 p-3 mb-4 rounded">
            {errorMessage || "Something went wrong. Please try again."}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordUI;
