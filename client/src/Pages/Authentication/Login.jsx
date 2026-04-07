import { useEffect, useRef, useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  ForgotPasswordPage,
  RouteIndex,
  SignUpPage,
} from "../../components/RouteNames/RouteName";
import toast, { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { resetError, signIn } from "../../features/authSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const justSubmitted = useRef(false);

  const { isLoading, isError, errorMessage, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { email, password };
    justSubmitted.current = true;
    dispatch(signIn(body));
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (justSubmitted.current) {
        setEmail("");
        setPassword("");
        toast.success("Login successful!");
        justSubmitted.current = false;
      }
      navigate(RouteIndex);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isError && errorMessage) {
      const message =
        typeof errorMessage === "string"
          ? errorMessage
          : "Something went wrong. Please try again.";
      toast.error(message);
      dispatch(resetError()); // Reset the error state
    }
  }, [isError, errorMessage, dispatch]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6 font-quicksand">
      <div className="relative group w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#ff5e00] to-orange-900 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-[#161616] border border-[#262626] rounded-[2.5rem] shadow-2xl p-10 w-full text-white overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#ff5e00]"></div>
          
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Access <span className="text-[#ff5e00]">Node</span></h2>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mt-2">Initialize Security Protocol</p>
          </div>
  
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Digital Identity</label>
              <div className="flex items-center bg-[#0a0a0a] border border-[#262626] rounded-2xl px-4 py-4 transition-all focus-within:border-[#ff5e00]/50 focus-within:ring-2 focus-within:ring-[#ff5e00]/20">
                <FaEnvelope className="text-gray-600 mr-4" />
                <input
                  type="email"
                  placeholder="USER@RESOURCES.COM"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent outline-none w-full text-white text-sm font-bold placeholder-gray-800"
                />
              </div>
            </div>
  
            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Security Key</label>
              <div className="flex items-center bg-[#0a0a0a] border border-[#262626] rounded-2xl px-4 py-4 transition-all focus-within:border-[#ff5e00]/50 focus-within:ring-2 focus-within:ring-[#ff5e00]/20">
                <FaLock className="text-gray-600 mr-4" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent outline-none w-full text-white text-sm font-bold placeholder-gray-800"
                />
              </div>
            </div>
  
            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to={ForgotPasswordPage}
                className="text-[10px] font-black text-gray-500 hover:text-[#ff5e00] uppercase tracking-widest transition-colors"
              >
                Key Recovery
              </Link>
            </div>
  
            {/* Login Button */}
            <button
              type="submit"
              className="bg-[#ff5e00] hover:bg-[#e65100] text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-orange-900/30 active:scale-95 text-xs uppercase tracking-[0.2em] mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                "Establish Link"
              )}
            </button>
          </form>
  
          {/* Sign Up Link */}
          <p className="text-center text-[10px] font-black uppercase tracking-widest mt-10 text-gray-500">
            No active node?{" "}
            <Link to={SignUpPage} className="text-[#ff5e00] hover:underline ml-1">
              Initialize New Account
            </Link>
          </p>
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
