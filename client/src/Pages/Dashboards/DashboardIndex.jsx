import CollaborationDashboard from "./CollaborationDashboard";
import DiscussionDashboard from "./DiscussionDashboard";
import GroupDashboard from "./GroupDashboard";
import ResourcesDashboardCard from "./ResourcesDashboardCard";

const DashboardIndex = () => {
  return (
    <div className="flex-1 font-quicksand">
      <div className="mb-12 relative group">
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#ff5e00] rounded-full group-hover:h-16 transition-all duration-300"></div>
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">
          CONTROL <span className="text-[#ff5e00]">CENTER</span>
        </h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Operational // StudySphere Node v2.0.4
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
        <div className="xl:col-span-1">
          <ResourcesDashboardCard />
        </div>
        <div className="xl:col-span-1">
          <GroupDashboard />
        </div>
        <div className="xl:col-span-1">
          <DiscussionDashboard />
        </div>
      </div>

      <div className="border-t border-[#262626] pt-8">
        <CollaborationDashboard />
      </div>
    </div>
  );
};

export default DashboardIndex;
