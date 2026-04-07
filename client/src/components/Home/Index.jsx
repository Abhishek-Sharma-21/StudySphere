import CommunityPost from "../../Pages/Community/CommunityPost";

const Index = () => {
  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Top Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-10 mb-10">
        <div className="flex items-center gap-6 group">
          <div className="w-16 h-16 bg-[#161616] border border-[#262626] border-b-4 border-b-[#ff5e00] rounded-2xl flex items-center justify-center text-4xl group-hover:-rotate-12 transition-transform">
            👋
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Welcome back, <span className="text-[#ff5e00]">Pioneer</span>!
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              What's buzzing in the orbit today?
            </p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-[#161616] border border-[#262626] rounded-xl text-center">
            <div className="text-xs font-black text-gray-500 uppercase">Streak</div>
            <div className="text-xl font-black text-[#ff5e00]">12 Days</div>
          </div>
          <div className="px-4 py-2 bg-[#161616] border border-[#262626] rounded-xl text-center">
            <div className="text-xs font-black text-gray-500 uppercase">Points</div>
            <div className="text-xl font-black text-white">1.2k</div>
          </div>
        </div>
      </div>

      <div className="px-10">
        <div className="flex items-center gap-4 mb-8">
           <h2 className="text-xl font-black text-white flex items-center gap-3">
              <span className="w-8 h-1 bg-[#ff5e00] rounded-full"></span>
              Community Feed
           </h2>
           <div className="h-px bg-[#262626] flex-1"></div>
        </div>
        <CommunityPost />
      </div>
    </div>
  );
};

export default Index;
