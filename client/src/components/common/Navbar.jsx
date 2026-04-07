import { Bell, Globe, Search } from "lucide-react";
import { Link } from "react-router-dom";
import {
  AISupport,
  DashboardIndexRoute,
  SignUpPage,
} from "../RouteNames/RouteName";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/authSlice";
import { getAllGroups } from "../../features/groupSlice";
import { useEffect } from "react";

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { groups } = useSelector((state) => state.groups);
  const currentUserId = user?._id || user?.user?._id;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getAllGroups());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Calculate pending requests for groups where user is admin
  const pendingRequestsCount = groups.reduce((total, group) => {
    const isAdmin = group.admins?.some(
      (admin) => String(admin._id || admin) === String(currentUserId)
    );
    if (isAdmin) {
      return total + (group.pendingRequests?.length || 0);
    }
    return total;
  }, 0);

  return (
    <nav className="flex justify-between font-poppins items-center bg-[#0a0a0a] px-6 py-2.5 fixed top-0 left-0 w-full z-50 border-b border-[#262626] backdrop-blur-md bg-opacity-90">
      {/* Logo Section */}
      <Link
        to="/"
        className="flex items-center gap-2 text-lg font-black cursor-pointer ml-4 group"
      >
        <Globe
          size={26}
          className="text-[#ff5e00] group-hover:rotate-12 transition-transform duration-500"
        />
        <h2 className="text-white hidden md:inline-block tracking-tight text-xl">
          Study<span className="text-[#ff5e00]">Sphere</span>
        </h2>
      </Link>

      {/* Search Section */}
      <div className="hidden md:flex items-center gap-3 bg-[#161616] border border-[#262626] w-xl px-4 py-2 rounded-xl focus-within:border-[#ff5e00] transition-all">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search everything..."
          className="bg-transparent focus:outline-none text-white placeholder-gray-600 w-full font-medium"
        />
      </div>

      {/* Button Section */}
      <div className="flex items-center gap-6 mr-4">
        <Link
          to={DashboardIndexRoute}
          className="text-sm font-bold text-gray-400 hover:text-[#ff5e00] transition-colors"
        >
          Dashboard
        </Link>

        <Link
          to={AISupport}
          className="text-sm font-bold text-gray-400 hover:text-[#ff5e00] transition-colors"
        >
          AI Support
        </Link>

        {isAuthenticated && (
          <div className="relative group/nav-bell">
            <Bell
              size={20}
              className={`text-gray-400 hover:text-[#ff5e00] transition-colors cursor-pointer ${
                pendingRequestsCount > 0 ? "animate-wiggle" : ""
              }`}
            />
            {pendingRequestsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#ff5e00] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0a0a0a] shadow-lg animate-pulse">
                {pendingRequestsCount}
              </span>
            )}
            
            {/* Hover Tooltip */}
            {pendingRequestsCount > 0 && (
              <div className="absolute top-full right-0 mt-4 w-48 bg-[#161616] border border-[#262626] rounded-xl p-3 opacity-0 invisible group-hover/nav-bell:opacity-100 group-hover/nav-bell:visible transition-all duration-300 shadow-2xl z-[60]">
                <p className="text-[10px] font-black text-white uppercase tracking-widest text-center">
                  {pendingRequestsCount} Pending Requests
                </p>
                <Link 
                  to="/group-index-page" 
                  className="block mt-2 text-[8px] font-black text-[#ff5e00] text-center uppercase tracking-[0.2em] hover:underline"
                >
                  Manage Colonies
                </Link>
              </div>
            )}
          </div>
        )}

        <div>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-rose-600/10 text-rose-500 border border-rose-600/20 px-4 py-1.5 rounded-xl text-sm font-black hover:bg-rose-600 hover:text-white transition-all active:scale-95 shadow-lg shadow-rose-900/10"
            >
              Logout
            </button>
          ) : (
            <Link
              to={SignUpPage}
              className="bg-[#ff5e00] text-white px-6 py-2 rounded-xl text-sm font-black hover:bg-[#e65100] transition-all active:scale-95 shadow-lg shadow-orange-900/20"
            >
              Join Us
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
