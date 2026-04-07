import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BookOpen, Download, Eye, Info } from "lucide-react";
import { DashboardIndexRoute, ResourceDashboard } from "../../components/RouteNames/RouteName";

const ResourcesDashboardCard = () => {
  const { groups } = useSelector((state) => state.groups);
  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?._id || user?.user?._id;

  // Aggregate all resources from groups where the user is a member
  const allResources = groups
    .filter(group => group.members?.some(m => String(m._id || m) === String(currentUserId)))
    .reduce((acc, group) => {
      const groupResources = (group.resources || []).map(res => ({
        ...res,
        groupName: group.name,
        groupId: group._id
      }));
      return [...acc, ...groupResources];
    }, [])
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="bg-[#161616] border border-[#262626] border-b-4 border-b-[#ff5e00] rounded-3xl p-8 shadow-xl h-full flex flex-col transition-all duration-500 hover:border-[#ff5e00]/20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0a0a0a] rounded-xl flex items-center justify-center text-[#ff5e00] border border-[#262626] shadow-inner">
            <BookOpen size={18} />
          </div>
          Resources
        </h2>
        <Link 
          to={`${DashboardIndexRoute}/${ResourceDashboard}`} 
          className="text-[10px] font-black text-[#ff5e00] uppercase tracking-widest hover:bg-[#ff5e00] hover:text-white px-4 py-2 bg-[#ff5e00]/10 rounded-xl transition-all border border-[#ff5e00]/20"
        >
          View Library
        </Link>
      </div>
      
      <div className="space-y-4 flex-1">
        {allResources.length > 0 ? (
          allResources.map((res) => (
            <div key={res._id} className="flex justify-between items-center bg-[#0a0a0a] border border-[#262626] p-4 rounded-2xl group/item hover:border-[#ff5e00]/30 transition-all cursor-pointer">
              <div className="flex flex-col min-w-0 pr-4">
                <span className="text-sm font-black text-gray-300 group-hover/item:text-white transition-colors truncate">
                  {res.name}
                </span>
                <span className="text-[8px] font-black text-[#ff5e00]/50 uppercase tracking-tighter mt-1 truncate">
                  Sector: {res.groupName}
                </span>
              </div>
              <div className="flex gap-2">
                {/* Eye Icon Button */}
                <button 
                  onClick={() => window.open(res.url, "_blank")} 
                  className="w-8 h-8 bg-[#0a0a0a] border border-[#262626] rounded-lg flex items-center justify-center text-gray-500 hover:text-[#ff5e00] hover:border-[#ff5e00] transition-all shadow-lg"
                  title="Preview"
                >
                  <Eye size={14} />
                </button>

                {/* Download Icon Button */}
                <button 
                  onClick={() => window.open(res.url, "_blank")} 
                  className="w-8 h-8 bg-[#0a0a0a] border border-[#262626] rounded-lg flex items-center justify-center text-gray-500 hover:text-[#ff5e00] hover:border-[#ff5e00] transition-all shadow-lg"
                  title="Open in New Tab"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-[#262626] rounded-[2rem] opacity-50">
             <Info size={24} className="text-gray-800 mb-2" />
             <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">No Node Data Transmitted</p>
          </div>
        )}
      </div>
      
      {allResources.length > 0 && (
        <div className="mt-8 pt-6 border-t border-[#262626]">
           <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-[#0a0a0a] rounded-full overflow-hidden border border-[#262626]">
                 <div className="w-[65%] h-full bg-gradient-to-r from-[#ff5e00] to-[#ff9100] shadow-[0_0_10px_rgba(255,94,0,0.5)]"></div>
              </div>
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Active Linkage</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesDashboardCard;
