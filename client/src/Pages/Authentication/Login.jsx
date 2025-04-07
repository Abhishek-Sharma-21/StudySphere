import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { SignUpPage } from "../../components/RouteNames/RouteName";
import { Loader } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loading = false;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-zinc-400 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-8 w-full max-w-md text-white">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>

        <form className="flex flex-col gap-4">
          {/* Email Field */}
          <div className="flex items-center border border-white/20 rounded-lg px-3 py-2">
            <FaEnvelope className="text-zinc-300 mr-3" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent outline-none w-full text-white placeholder-zinc-400"
            />
          </div>

          {/* Password Field */}
          <div className="flex items-center border border-white/20 rounded-lg px-3 py-2">
            <FaLock className="text-zinc-300 mr-3" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent outline-none w-full text-white placeholder-zinc-400"
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right text-sm">
            <Link
              to="/forgot-password"
              className="text-zinc-300 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
            disabled={loading}
          >
            {loading ? (
              <Loader className="h-6 w-6 animate-spin mx-auto" />
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-sm mt-6 text-zinc-300">
          Don't have an account?{" "}
          <Link to={SignUpPage} className="text-green-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
