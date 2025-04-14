import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "lucide-react";
import { forgetPassword } from "../../features/authSlice.js";
import { ResetPasswordpage } from "../../components/RouteNames/RouteName";

const ForgotPasswordUI = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isError, errorMessage } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { email };
    const result = await dispatch(forgetPassword(body));
    if (result.error) {
      console.log(result.error);
    } else {
      const token = result.payload.resetToken; // Ensure the token is returned from the API
      navigate(`/reset-password/${token}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-zinc-400 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-8 w-full max-w-md text-white">
        <h2 className="text-3xl font-bold text-center mb-6">
          Forgot Password?
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email Field */}
          <div className="flex items-center border border-white/20 rounded-lg px-3 py-2">
            <FaEnvelope className="text-zinc-300 mr-3" />
            <input
              type="email"
              placeholder="Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent outline-none w-full text-white placeholder-zinc-400"
              required
            />
          </div>

          {/* Send Reset Email Button */}
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-lg transition"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Send Email Address"
            )}
          </button>
        </form>
        {isError && (
          <div className="bg-red-100 text-center text-red-700 p-3 mt-4 mb-4 rounded">
            {errorMessage || "Something went wrong. Please try again."}
          </div>
        )}

        <p className="text-center text-sm mt-4 text-zinc-300">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordUI;
