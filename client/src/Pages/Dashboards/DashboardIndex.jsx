import CollaborationDashboard from "./CollaborationDashboard";
import DiscussionDashboard from "./DiscussionDashboard";
import GroupDashboard from "./GroupDashboard";
import ResourcesDashboard from "./ResourcesDashboard";

const DashboardIndex = () => {
  return (
    <main className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to StudySphere!</h1>
        <p className="text-gray-600">
          Your ultimate hub for collaborative learning and resource sharing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ResourcesDashboard />
        <GroupDashboard />
        <DiscussionDashboard />
      </div>

      <CollaborationDashboard />
    </main>
  );
};

export default DashboardIndex;
