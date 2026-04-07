import { Globe, Radio, User, Activity } from "lucide-react";
import {
  CommunityDashboardRoute,
  DashboardGroupDetailRoute,
  DashboardIndexRoute,
  DiscussionDashboardRoute,
  GroupDashboardRoute,
  GroupHomePage,
  ResourceDashboard,
  RouteIndex,
  SettingsRoute,
} from "../../components/RouteNames/RouteName";

import {
  FaHome,
  FaBook,
  FaComments,
  FaUsers,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdGroup } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllGroups } from "../../features/groupSlice";
import { logoutUser } from "../../features/authSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isInCall } = useSelector((state) => state.liveSync);
  const { groups } = useSelector((state) => state.groups);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const currentUserId = user?._id || user?.user?._id;

  useEffect(() => {
    if (isAuthenticated && groups.length === 0) {
      dispatch(getAllGroups());
    }
  }, [dispatch, isAuthenticated, groups.length]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Filter groups where the current user is a member
  const myGroups = groups.filter((group) =>
    group.members?.some((m) => String(m._id || m) === String(currentUserId))
  );

  return (
    <aside className={`flex flex-col h-screen fixed top-0 ${isInCall ? "w-20 px-4" : "w-64 p-6"} bg-[#0a0a0a] border-r border-[#262626] text-white overflow-y-auto no-scrollbar shadow-2xl z-40 transition-all duration-500`}>
      {/* ── Logo ── */}
      <Link to={RouteIndex} className={`flex items-center mb-12 group ${isInCall ? "justify-center" : "px-2"}`} title="StudySphere Home">
        <div className="w-12 h-12 bg-gradient-to-br from-[#ff5e00] to-[#e65100] rounded-2xl flex items-center justify-center shadow-xl shadow-orange-900/20 group-hover:rotate-12 transition-all duration-500 border border-[#ff5e00]/20 flex-shrink-0">
          <Globe size={24} className="text-white" />
        </div>
        {!isInCall && (
          <div className="flex flex-col ml-4">
            <span className="text-xl font-black tracking-tighter uppercase leading-none">
              Study<span className="text-[#ff5e00]">Sphere</span>
            </span>
            <span className="text-[8px] font-black text-gray-600 uppercase tracking-[0.4em] mt-1 pl-0.5">
              Neural Network
            </span>
          </div>
        )}
      </Link>

      {/* ── Main Navigation ── */}
      <nav className="flex-1 space-y-2">
        <div className={`text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] mb-6 flex items-center gap-2 ${isInCall ? "justify-center" : "ml-4"}`}>
          <div className="w-1 h-3 bg-[#ff5e00] rounded-full"></div>
          {!isInCall && "Command Center"}
        </div>
        
        <SidebarLink
          to={DashboardIndexRoute}
          icon={<FaHome size={18} />}
          label="Overview"
          active={location.pathname === DashboardIndexRoute}
          collapsed={isInCall}
        />
        <SidebarLink
          to={`${DashboardIndexRoute}/${ResourceDashboard}`}
          icon={<FaBook size={18} />}
          label="Repository"
          active={location.pathname === `${DashboardIndexRoute}/${ResourceDashboard}`}
          collapsed={isInCall}
        />
        <SidebarLink
          to={`${DashboardIndexRoute}/${DiscussionDashboardRoute}`}
          icon={<FaComments size={18} />}
          label="Discourse"
          active={location.pathname === `${DashboardIndexRoute}/${DiscussionDashboardRoute}`}
          collapsed={isInCall}
        />
        <SidebarLink
          to={`${DashboardIndexRoute}/${CommunityDashboardRoute}`}
          icon={<MdGroup size={18} />}
          label="Global Sync"
          active={location.pathname === `${DashboardIndexRoute}/${CommunityDashboardRoute}`}
          collapsed={isInCall}
        />

        {/* ── Joined Colonies Section ── */}
        <div className={isInCall ? "pt-6 pb-2" : "pt-10 pb-4"}>
          {!isInCall ? (
            <Link 
              to={`${DashboardIndexRoute}/${GroupDashboardRoute}`}
              className="text-[10px] font-black text-gray-700 hover:text-white uppercase tracking-[0.3em] mb-6 ml-4 flex items-center gap-2 group/header transition-colors"
            >
              <div className="w-1 h-3 bg-[#ff5e00] rounded-full group-hover/header:h-4 transition-all"></div>
              Active Colonies
            </Link>
          ) : (
            <div className="flex justify-center mb-6">
               <div className="w-1 h-3 bg-gray-800 rounded-full"></div>
            </div>
          )}
          
          <div className={`space-y-3 ${isInCall ? "" : "px-2"}`}>
            {myGroups.length > 0 ? (
              myGroups.slice(0, 3).map((group) => (
                <Link
                  key={group._id}
                  to={`${DashboardIndexRoute}/groups/${group._id}`}
                  className={`flex items-center gap-4 group/colony transition-all duration-300 ${isInCall ? "justify-center" : ""}`}
                  title={group.name}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 relative flex-shrink-0 ${
                    location.pathname.includes(group._id) 
                    ? "bg-[#ff5e00]/10 border-[#ff5e00] text-[#ff5e00]" 
                    : "bg-[#161616] border-[#262626] text-gray-600 group-hover/colony:border-[#ff5e00]/50"
                  }`}>
                    <span className="text-[10px] font-black uppercase">{group.name?.[0]}</span>
                    {group.isLive && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-[#0a0a0a] animate-pulse"></span>
                    )}
                  </div>
                  {!isInCall && (
                    <div className="flex flex-col min-w-0">
                      <span className={`text-[10px] font-black uppercase tracking-widest truncate transition-colors ${
                        location.pathname.includes(group._id) ? "text-white" : "text-gray-500 group-hover/colony:text-gray-300"
                      }`}>
                        {group.name}
                      </span>
                      {group.isLive && (
                        <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
                          <Radio size={8} /> LIVE_FEED
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              ))
            ) : !isInCall && (
              <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest italic ml-4">
                No Active Synchronizations
              </p>
            )}

            {!isInCall && (
              <div className="pt-2 space-y-1">
                {myGroups.length > 3 && (
                  <Link 
                    to={`${DashboardIndexRoute}/${GroupDashboardRoute}`}
                    className="flex items-center gap-4 py-2 px-4 text-gray-600 hover:text-white transition-colors group/viewall"
                  >
                    <Activity size={12} className="group-hover/viewall:animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">View All Syncs ({myGroups.length})</span>
                  </Link>
                )}
                
                <Link 
                  to={GroupHomePage}
                  className="flex items-center gap-4 py-2 px-4 text-gray-600 hover:text-[#ff5e00] transition-colors"
                >
                   <FaUsers size={12} />
                   <span className="text-[8px] font-black uppercase tracking-[0.2em]">Explore More Sectors</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── Configuration ── */}
        <div className={isInCall ? "pt-6" : "pt-10"}>
          <div className={`text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] mb-6 flex items-center gap-2 ${isInCall ? "justify-center" : "ml-4"}`}>
            <div className="w-1 h-3 bg-gray-700 rounded-full"></div>
            {!isInCall && "Config"}
          </div>
          <SidebarLink
            to={`${DashboardIndexRoute}/${SettingsRoute}`}
            icon={<FaCog size={18} />}
            label="System Settings"
            active={location.pathname === `${DashboardIndexRoute}/${SettingsRoute}`}
            collapsed={isInCall}
          />
        </div>
      </nav>

      {/* ── Identity Context ── */}
      <div className={`mt-auto pt-8 border-t border-[#262626] space-y-6 ${isInCall ? "items-center" : ""}`}>
        <div className={`flex items-center gap-4 ${isInCall ? "justify-center" : "px-2"}`} title={user?.name}>
           <div className="w-10 h-10 bg-[#161616] rounded-xl border border-[#262626] flex items-center justify-center text-gray-500 flex-shrink-0">
             <User size={18} />
           </div>
           {!isInCall && (
             <div className="flex flex-col min-w-0">
               <span className="text-[10px] font-black text-white uppercase tracking-tighter truncate">{user?.name || "Guest_Node"}</span>
               <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest truncate">Access Level: STUDENT</span>
             </div>
           )}
        </div>

        <button
          onClick={handleLogout}
          className={`group/logout flex items-center transition-all duration-300 py-4 rounded-2xl bg-rose-900/5 text-gray-500 hover:text-rose-500 border border-transparent hover:border-rose-900/30 ${isInCall ? "justify-center px-0 w-12 mx-auto" : "w-full gap-4 px-6"}`}
          title="Terminate Session"
        >
          <FaSignOutAlt size={16} className="group-hover/logout:-translate-x-1 transition-transform" />
          {!isInCall && <span className="text-[10px] font-black uppercase tracking-[0.3em]">Terminate</span>}
        </button>
      </div>
    </aside>
  );
};

const SidebarLink = ({ to, icon, label, active, collapsed }) => (
  <Link
    to={to}
    title={collapsed ? label : ""}
    className={`flex items-center transition-all duration-300 rounded-2xl relative group ${collapsed ? "justify-center px-0 w-12 h-12 mx-auto" : "py-4 px-6 w-full gap-4"} ${
      active 
        ? "bg-[#161616] text-[#ff5e00] border border-[#262626] shadow-xl shadow-black/40" 
        : "text-gray-500 hover:text-gray-300 hover:bg-[#0d0d0d]"
    }`}
  >
    <span className={`${active ? "text-[#ff5e00]" : "text-gray-700 group-hover:text-[#ff5e00]"} transition-colors`}>{icon}</span>
    {!collapsed && <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>}
    
    {active && (
      <div className={`absolute bg-[#ff5e00] rounded-full shadow-[0_0_10px_#ff5e00] animate-pulse ${collapsed ? "right-2 w-1 h-1" : "right-6 w-1.5 h-1.5"}`}></div>
    )}
  </Link>
);

export default Sidebar;
