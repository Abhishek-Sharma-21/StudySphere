import { Globe } from "lucide-react";
import {
  CommunityDashboardRoute,
  DashboardIndexRoute,
  DiscussionDashboardRoute,
  GroupDashboardRoute,
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
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="flex flex-col h-full w-64 bg-gray-900 text-white p-6">
      {/* Logo */}
      <Link to={RouteIndex} className="flex items-center mb-10">
        <Globe size={28} className="text-white mr-3" />
        <span className="text-2xl font-bold">StudySphere</span>
      </Link>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        <SidebarLink
          to={DashboardIndexRoute}
          icon={<FaHome />}
          label="Dashboard"
        />
        <SidebarLink
          to={ResourceDashboard}
          icon={<FaBook />}
          label="Resources"
        />
        <SidebarLink
          to={DiscussionDashboardRoute}
          icon={<FaComments />}
          label="Discussions"
        />
        <SidebarLink
          to={GroupDashboardRoute}
          icon={<FaUsers />}
          label="Groups"
        />
        <SidebarLink to={SettingsRoute} icon={<FaCog />} label="Settings" />
        <SidebarLink
          to={CommunityDashboardRoute}
          icon={<MdGroup />}
          label="community"
        />
      </nav>

      {/* Bottom Sign Out */}
      <div className="pt-10">
        <SidebarLink to="#" icon={<FaSignOutAlt />} label="Logout" />
      </div>
    </aside>
  );
};

const SidebarLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200"
  >
    {icon}
    <span className="text-base">{label}</span>
  </Link>
);

export default Sidebar;
