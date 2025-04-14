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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-zinc-700 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-8 w-full max-w-md text-white">
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              placeholder="Full Name"
              className={`w-full pl-10 pr-4 py-2 rounded-md bg-white/10 border border-gray-400 focus:border-white focus:outline-none ${
                errors.name ? "border-red-500" : ""
              }`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="email"
              placeholder="Email Address"
              className={`w-full pl-10 pr-4 py-2 rounded-md bg-white/10 border border-gray-400 focus:border-white focus:outline-none ${
                errors.email ? "border-red-500" : ""
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-md bg-white/10 border border-gray-400 focus:border-white focus:outline-none ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Password Strength Bar */}
          <div className="mt-2">
            <div className="flex justify-between text-sm text-gray-300 mb-1">
              <span>Password strength</span>{" "}
              {password.length === 0 ? (
                ""
              ) : !strength.length ? (
                <span className="text-red-400">Weak</span>
              ) : !strength.uppercase ? (
                <span className="text-yellow-600">normal</span>
              ) : !strength.lowercase ? (
                <span className="text-green-600">Fair</span>
              ) : !strength.number ? (
                <span className="text-green-600">Good</span>
              ) : !strength.special ? (
                <span className="text-green-600">Strong</span>
              ) : (
                <span className="text-green-600">Excellent</span>
              )}
            </div>
            <div className="h-2 w-full bg-gray-300 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  password.length >= 6 ? "bg-green-500" : "bg-red-500"
                }`}
                style={{
                  width: `${
                    (Object.values(strength).filter(Boolean).length / 5) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Validation Checklist */}
          <div className="text-xs text-gray-300 mt-2 space-y-1">
            <p className={strength.length ? "text-green-400" : "text-red-400"}>
              {strength.length ? "✔" : "✘"} At least 6 characters
            </p>
            <p
              className={strength.uppercase ? "text-green-400" : "text-red-400"}
            >
              {strength.uppercase ? "✔" : "✘"} Contains uppercase letter
            </p>
            <p
              className={strength.lowercase ? "text-green-400" : "text-red-400"}
            >
              {strength.lowercase ? "✔" : "✘"} Contains lowercase letter
            </p>
            <p className={strength.number ? "text-green-400" : "text-red-400"}>
              {strength.number ? "✔" : "✘"} Contains a number
            </p>
            <p className={strength.special ? "text-green-400" : "text-red-400"}>
              {strength.special ? "✔" : "✘"} Contains special character
            </p>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="mt-4 bg-green-500 hover:bg-green-600 transition-colors py-2 rounded-md font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="text-center text-sm text-gray-300 mt-4">
            Already have an account?{" "}
            <Link
              to={LoginPage}
              className="underline text-green-400 hover:text-green-500"
            >
              Log in
            </Link>
          </p>
        </form>
        {isError && (
          <div className="bg-red-100 text-center text-red-700 p-3 mb-4 rounded">
            {errorMessage || "Something went wrong. Please try again."}
          </div>
        )}
      </div>
    </div>
  );
}
