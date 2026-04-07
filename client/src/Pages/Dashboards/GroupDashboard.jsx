import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Users, Clock, ArrowRight, Layout } from "lucide-react";
import { getAllGroups } from "../../features/groupSlice";
import { 
  GroupHomePage, 
  GroupDashboardRoute,
  DashboardIndexRoute
} from "../../components/RouteNames/RouteName";



const GroupDashboard = () => {
  const dispatch = useDispatch();
  const { groups, loading } = useSelector((state) => state.groups);
  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?._id || user?.user?._id;

  useEffect(() => {
    dispatch(getAllGroups());
  }, [dispatch]);

  const joinedGroups = groups.filter((group) =>
    group.members?.some((m) => String(m._id || m) === String(currentUserId))
  );

  return (
    <div className="bg-[#161616] border border-[#262626] border-b-4 border-b-[#ff5e00] rounded-2xl p-6 shadow-xl h-full flex flex-col transition-all duration-300 hover:bg-[#1a1a1a]">
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
          <div className="w-8 h-8 bg-[#262626] rounded-lg flex items-center justify-center text-[#ff5e00] border border-[#333]">
            <Users size={14} />
          </div>
          My Circles
        </h2>
        <Link to={`${DashboardIndexRoute}/${GroupDashboardRoute}`} className="text-[10px] font-black text-[#ff5e00] uppercase tracking-widest hover:underline px-3 py-1 bg-[#ff5e00]/10 rounded-md flex items-center gap-1 group">
          Explore
          <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>

      </div>

      <div className="flex-1">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-[#0a0a0a] border border-[#262626] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : joinedGroups.length > 0 ? (
          <ul className="space-y-3">
            {joinedGroups.map((group) => (
              <li key={group._id} className="group/item flex items-center p-4 bg-[#0a0a0a] border border-[#262626] hover:border-[#ff5e00]/50 rounded-xl transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#ff5e00]/5 rounded-full -mr-8 -mt-8 blur-2xl group-hover/item:bg-[#ff5e00]/10 transition-colors"></div>
                
                <div className="w-10 h-10 rounded-lg bg-[#161616] border border-[#262626] flex items-center justify-center text-[#ff5e00] mr-4 shadow-sm group-hover/item:scale-110 transition-transform relative z-10">
                  <Layout className="w-5 h-5" />
                </div>
                <div className="flex-1 relative z-10">
                  <h3 className="font-black text-gray-300 group-hover/item:text-white transition-colors text-sm">{group.name}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{group.members?.length} MEMBERS</span>
                  </div>
                </div>
                <Link to={`${DashboardIndexRoute}/groups/${group._id}`} className="p-2 opacity-0 group-hover/item:opacity-100 transition-all text-[#ff5e00] relative z-10">
                  <ArrowRight className="w-4 h-4" />
                </Link>

              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10 px-4 bg-[#0a0a0a] rounded-xl border border-dashed border-[#262626]">
            <p className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">No circles joined yet</p>
            <Link to={GroupHomePage} className="inline-flex items-center gap-2 bg-[#ff5e00] text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-900/20 hover:bg-[#e65100] transition-all">
              Initialize Search
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};

export default GroupDashboard;
