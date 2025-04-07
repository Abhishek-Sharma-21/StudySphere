import { Globe, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { AISupport, dashboardPage, SignUpPage } from "../RouteNames/RouteName";

const Navbar = () => {
  return (
    <nav className="flex justify-between font-poppins items-center bg-white shadow-md px-6 py-4 fixed top-0 left-0 w-full z-50">
      {/* Logo Section */}
      <Link
        to="/"
        className="flex items-center gap-2 text-xl font-semibold cursor-pointer ml-10 text-gray-800"
      >
        <Globe size={28} color="#422bf3" />
        <h2 className="text-gray-700 hidden md:inline-block">
          Study<span className="text-black">Sphere</span>
        </h2>
      </Link>

      {/* Search Section */}
      <div className="hidden md:flex items-center gap-2 bg-gray-100  w-3xl px-3 py-2 rounded-lg">
        <Search className="text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent focus:outline-none text-gray-800 placeholder-gray-400"
        />
      </div>
      <div className="flex justify-between gap-8 mr-4">
        {/* Dashboard */}
        <div>
          <Link
            to={dashboardPage}
            className="text-gray-800 hover:text-gray-600 hover:underline"
          >
            Dashboard
          </Link>
        </div>

        {/* Ai support */}
        <div>
          <Link
            to={AISupport}
            className="text-gray-800 hover:text-gray-600 hover:underline"
          >
            AI Support
          </Link>
        </div>

        {/* Button Section */}
        <div>
          <Link
            to={SignUpPage}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
