import { Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center bg-white shadow-md px-6 py-4 fixed top-0 left-0 w-full z-50">
      {/* Logo Section */}
      <Link
        to="/"
        className="flex items-center gap-2 text-xl font-semibold text-gray-800"
      >
        <Globe size={28} color="#422bf3" />
        <h2 className="text-gray-700 hidden md:inline-block ">
          Study<span className="text-black">Sphere</span>
        </h2>
      </Link>

      {/* Links Section (Placeholder) */}
      <div className="hidden md:flex gap-6 text-gray-600">
        <Link to="/about" className="hover:text-blue-600 transition">
          About
        </Link>
        <Link to="/courses" className="hover:text-blue-600 transition">
          Courses
        </Link>
        <Link to="/contact" className="hover:text-blue-600 transition">
          Contact
        </Link>
      </div>

      {/* Button Section */}
      <div>
        <Link
          to="/signup"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
