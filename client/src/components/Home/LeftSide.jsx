import {
  Folder,
  House,
  Info,
  Mail,
  MessageSquare,
  MessageSquareText,
  Plus,
  Star,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  AboutPage,
  ContactPage,
  CreateCommunityPosts,
  DiscussionHomePage,
  FeaturePage,
  GroupHomePage,
  ResourceHomepage,
  RouteIndex,
} from "../RouteNames/RouteName";

const LeftSide = () => {
  const navigate = useNavigate();
  const handleContributeButton = () => {
    navigate(CreateCommunityPosts);
  };
  return (
    <div className="flex flex-col gap-6 w-full font-quicksand">
      <div className="flex flex-col gap-1.5 px-2">
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-4">Main Menu</label>
        
        <Link
          to={RouteIndex}
          className="group hover:bg-[#1e1e1e] rounded-xl p-3 flex items-center gap-3 transition-all border border-transparent hover:border-[#262626]"
        >
          <House size={20} className="text-gray-400 group-hover:text-[#ff5e00] transition-colors" />
          <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Home</span>
        </Link>

        <Link
          to={GroupHomePage}
          className="group hover:bg-[#1e1e1e] rounded-xl p-3 flex items-center gap-3 transition-all border border-transparent hover:border-[#262626]"
        >
          <MessageSquareText size={20} className="text-gray-400 group-hover:text-[#ff5e00] transition-colors" />
          <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Groups</span>
        </Link>

        <Link
          to={DiscussionHomePage}
          className="group hover:bg-[#1e1e1e] rounded-xl p-3 flex items-center gap-3 transition-all border border-transparent hover:border-[#262626]"
        >
          <MessageSquare size={20} className="text-gray-400 group-hover:text-[#ff5e00] transition-colors" />
          <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Discussions</span>
        </Link>

        <Link
          to={ResourceHomepage}
          className="group hover:bg-[#1e1e1e] rounded-xl p-3 flex items-center gap-3 transition-all border border-transparent hover:border-[#262626]"
        >
          <Folder size={20} className="text-gray-400 group-hover:text-[#ff5e00] transition-colors" />
          <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Resources</span>
        </Link>
      </div>

      <div className="px-4 py-2">
        <div className="h-px bg-[#262626] w-full" />
      </div>

      <div className="flex flex-col gap-1.5 px-2">
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-4">Support</label>
        
        <Link
          to={AboutPage}
          className="group hover:bg-[#1e1e1e] rounded-xl p-3 flex items-center gap-3 transition-all border border-transparent hover:border-[#262626]"
        >
          <Info size={20} className="text-gray-400 group-hover:text-[#ff5e00] transition-colors" />
          <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">About Us</span>
        </Link>
        <Link
          to={ContactPage}
          className="group hover:bg-[#1e1e1e] rounded-xl p-3 flex items-center gap-3 transition-all border border-transparent hover:border-[#262626]"
        >
          <Mail size={20} className="text-gray-400 group-hover:text-[#ff5e00] transition-colors" />
          <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Contact Us</span>
        </Link>
        <Link
          to={FeaturePage}
          className="group hover:bg-[#1e1e1e] rounded-xl p-3 flex items-center gap-3 transition-all border border-transparent hover:border-[#262626]"
        >
          <Star size={20} className="text-gray-400 group-hover:text-[#ff5e00] transition-colors" />
          <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Features</span>
        </Link>
      </div>

      <div className="mt-auto px-4 pb-4">
        <button
          onClick={handleContributeButton}
          className="w-full bg-[#ff5e00] hover:bg-[#e65100] text-white font-black py-4 rounded-[1.5rem] flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20 transition-all active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          Contribute
        </button>
      </div>
    </div>
  );
};
export default LeftSide;
