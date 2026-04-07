import { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { LoginPage, RouteIndex } from "../../components/RouteNames/RouteName";
import { Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { SignUp } from "../../features/authSlice";

export default function Signup() {
  const dispatch = useDispatch();
  const { isLoading, isError, errorMessage } = useSelector(
    (state) => state.auth
  );

  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const checkStrength = (password) => {
    return {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  };

  const strength = checkStrength(password);

  //validate form

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // valid if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      //send data to server
      const body = {
        name: name,
        email: email,
        password: password,
      };
      try {
        const result = await dispatch(SignUp(body));
        console.log("Form submitted:", body);
        if (SignUp.fulfilled.match(result)) {
          setEmail("");
          setName("");
          setPassword("");
          navigate(RouteIndex);
        } else {
          console.log("Signup failed:", result.payload);
        }
      } catch (error) {
        console.error("UnExpected Error:", error);
      }
    } else {
      console.log("Form has error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6 font-quicksand">
      <div className="relative group w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#ff5e00] to-orange-900 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-[#161616] border border-[#262626] rounded-[3rem] shadow-2xl p-10 w-full text-white overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#ff5e00]"></div>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Initialize <span className="text-[#ff5e00]">Node</span></h2>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mt-2">New Identity Registration</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Identity Name</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  placeholder="STUDENT IDENTIFIER"
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-[#0a0a0a] border border-[#262626] focus:border-[#ff5e00]/50 focus:ring-2 focus:ring-[#ff5e00]/20 text-sm font-bold text-white outline-none transition-all placeholder-gray-800 ${
                    errors.name ? "border-rose-500/50" : ""
                  }`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && (
                  <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{errors.name}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Digital Signature</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="email"
                  placeholder="USER@NETWORK.COM"
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-[#0a0a0a] border border-[#262626] focus:border-[#ff5e00]/50 focus:ring-2 focus:ring-[#ff5e00]/20 text-sm font-bold text-white outline-none transition-all placeholder-gray-800 ${
                    errors.email ? "border-rose-500/50" : ""
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Security Key</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-[#0a0a0a] border border-[#262626] focus:border-[#ff5e00]/50 focus:ring-2 focus:ring-[#ff5e00]/20 text-sm font-bold text-white outline-none transition-all placeholder-gray-800 ${
                    errors.password ? "border-rose-500/50" : ""
                  }`}
                />
                {errors.password && (
                  <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Password Strength Bar */}
            <div className="bg-[#0a0a0a] p-4 rounded-2xl border border-[#262626]">
              <div className="flex justify-between text-[10px] font-black uppercase text-gray-500 mb-2">
                <span>Entropy Status</span>{" "}
                {password.length === 0 ? (
                  ""
                ) : !strength.length ? (
                  <span className="text-rose-500">Critical</span>
                ) : !strength.uppercase ? (
                  <span className="text-yellow-600">Standard</span>
                ) : !strength.lowercase ? (
                  <span className="text-[#ff5e00]">Verified</span>
                ) : !strength.number ? (
                  <span className="text-[#ff5e00]">Enhanced</span>
                ) : !strength.special ? (
                  <span className="text-emerald-500">Robust</span>
                ) : (
                  <span className="text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]">Maximum</span>
                )}
              </div>
              <div className="h-1 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ${
                    password.length >= 6 ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                  style={{
                    width: `${
                      (Object.values(strength).filter(Boolean).length / 5) * 100
                    }%`,
                  }}
                />
              </div>

              {/* Validation Checklist */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-4">
                {[
                  { key: 'length', text: '6+ Char' },
                  { key: 'uppercase', text: 'Upper Cas' },
                  { key: 'lowercase', text: 'Lower Cas' },
                  { key: 'number', text: 'Numeric' },
                  { key: 'special', text: 'Symbol' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${strength[item.key] ? "bg-[#ff5e00]" : "bg-gray-800"}`}></div>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${strength[item.key] ? "text-gray-300" : "text-gray-600"}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="mt-4 bg-[#ff5e00] hover:bg-[#e65100] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-900/30 active:scale-95 transition-all disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                "Establish Linkage"
              )}
            </button>

            <p className="text-center text-[10px] font-black uppercase tracking-widest mt-2 text-gray-500">
              Already identified?{" "}
              <Link
                to={LoginPage}
                className="text-[#ff5e00] hover:underline ml-1"
              >
                Access Node
              </Link>
            </p>
          </form>
          {isError && (
            <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
              <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest text-center">{errorMessage || "Transmission Failure"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
