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
  FeaturePage,
  RouteIndex,
} from "../RouteNames/RouteName";

const LeftSide = () => {
  const navigate = useNavigate();
  const handleContributeButton = () => {
    navigate(CreateCommunityPosts);
  };
  return (
    <div className="flex flex-col gap-6 p-4 w-60  overflow-y-auto font-nunito">
      <div className="flex flex-col gap-2 text-gray-800 font-semibold ml-14">
        <Link
          to={RouteIndex}
          className="hover:bg-gray-200 rounded-lg p-2 flex items-center gap-3 transition-all"
        >
          <House size={18} />
          <span className="text-gray-800">Home</span>
        </Link>

        <Link className="hover:bg-gray-200 rounded-lg p-2 flex items-center gap-3 transition-all">
          <MessageSquareText size={18} />
          Groups
        </Link>
        <Link className="hover:bg-gray-200 rounded-lg p-2 flex items-center gap-3 transition-all">
          <MessageSquare size={18} />
          Discussions
        </Link>
        <Link className="hover:bg-gray-200 rounded-lg p-2 flex items-center gap-3 transition-all">
          <Folder size={18} />
          Resources
        </Link>
      </div>
      <hr className="border-gray-400" />
      <div className="flex flex-col gap-2 text-gray-800 font-semibold ml-14">
        <Link
          to={AboutPage}
          className="hover:bg-gray-200 rounded-lg p-2 flex items-center gap-3 transition-all"
        >
          <Info />
          About us
        </Link>
        <Link
          to={ContactPage}
          className="hover:bg-gray-200 rounded-lg p-2 flex items-center gap-3 transition-all"
        >
          <Mail />
          Contact us
        </Link>
        <Link
          to={FeaturePage}
          className="hover:bg-gray-200 rounded-lg p-2 flex items-center gap-3 transition-all"
        >
          <Star />
          Features
        </Link>
      </div>
      <hr className="border-gray-400" />
      <div className="flex flex-col gap-2 text-gray-800 font-semibold ml-14">
        <button
          onClick={handleContributeButton}
          className="hover:bg-gray-200 rounded-lg p-2 flex items-center gap-2 transition-all"
        >
          <Plus />
          Contribute
        </button>
      </div>
    </div>
  );
};
export default LeftSide;
