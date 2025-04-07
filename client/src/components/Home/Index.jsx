import CommunityPost from "../../Pages/Community/CommunityPost";

const Index = () => {
  return (
    <div>
      {/* Top Welcome Section */}
      <div className="text-3xl font-semibold  ml-10 space-x-4 flex font-inter items-center">
        <span className="text-5xl">👋</span>
        <div>
          <div>
            Welcome back, <span className="text-blue-600">User</span>!
          </div>
          <h2 className="text-sm text-gray-500 mt-2">
            📣 What's Buzzing in the Community?
          </h2>
        </div>
      </div>
      <hr className="text-gray-400 w-full mt-4" />
      {/* Community Posts */}
      <div className="px-6">
        <CommunityPost />
      </div>
    </div>
  );
};

export default Index;
