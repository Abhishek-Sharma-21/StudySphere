import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdEdit, MdDelete, MdMessage } from "react-icons/md";
import { getAllCommunityPosts } from "../../features/communityPostSlice";
import { Link } from "react-router-dom";
import { timeAgo } from "../../utils/communityHelpers";

const DiscussionDashboard = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.communityPost);
  const { token, user } = useSelector((state) => state.auth);
  const currentUserId = user?._id || user?.user?._id;

  useEffect(() => {
    if (token) {
      dispatch(getAllCommunityPosts({ page: 1, limit: 50, category: "discussion" }));
    }
  }, [dispatch, token]);

  const myDiscussions = data?.filter(discussion => 
    String(discussion.creator?._id || discussion.creator) === String(currentUserId)
  ) || [];

  return (
    <div className="md:col-span-2 font-quicksand bg-[#161616] border border-[#262626] border-b-4 border-b-[#ff5e00] rounded-2xl p-6 shadow-xl h-full flex flex-col transition-all duration-300 hover:bg-[#1a1a1a]">
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
          <div className="w-8 h-8 bg-[#262626] rounded-lg flex items-center justify-center text-[#ff5e00] border border-[#333]">
            <MdMessage size={16} />
          </div>
          My Discussions
        </h2>
        <Link to="/discussion-index-page" className="text-[10px] font-black text-[#ff5e00] uppercase tracking-widest hover:underline px-3 py-1 bg-[#ff5e00]/10 rounded-md flex items-center gap-1 group">
          Browse All
        </Link>
      </div>

      <div className="flex-1">
        {loading && !myDiscussions.length ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-16 bg-[#0a0a0a] border border-[#262626] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : myDiscussions.length > 0 ? (
          <ul className="space-y-3">
            {myDiscussions.map((discussion) => (
              <li 
                key={discussion._id} 
                className="group/item flex justify-between items-center bg-[#0a0a0a] border border-[#262626] p-4 rounded-xl hover:border-[#ff5e00]/50 hover:bg-[#111] transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#ff5e00]/5 rounded-full -mr-8 -mt-8 blur-2xl group-hover/item:bg-[#ff5e00]/10 transition-colors"></div>
                
                <div className="flex-1 min-w-0 pr-4 relative z-10">
                  <Link 
                    to={`/community/${discussion._id}`}
                    className="font-black text-gray-300 group-hover/item:text-white transition-colors truncate block text-sm"
                  >
                    {discussion.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{timeAgo(discussion.createdAt)}</span>
                    <span className="text-[#262626]">·</span>
                    <span className="text-[10px] text-[#ff5e00] font-black uppercase tracking-widest bg-[#ff5e00]/10 px-2 py-0.5 rounded">
                      {discussion.comments?.length || 0} REPLIES
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity relative z-10">
                  <button className="p-2 text-gray-500 hover:text-[#ff5e00] hover:bg-[#ff5e00]/10 rounded-lg transition-all border border-transparent hover:border-[#ff5e00]/30">
                    <MdEdit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all border border-transparent hover:border-rose-500/30">
                    <MdDelete className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 bg-[#0a0a0a] rounded-xl border border-dashed border-[#262626]">
            <div className="w-12 h-12 bg-[#161616] rounded-xl flex items-center justify-center mx-auto mb-4 text-gray-600 border border-[#262626]">
               <MdMessage size={24} />
            </div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">No active frequency found</p>
            <Link
              to="/discussion-index-page"
              className="text-[10px] font-black text-[#ff5e00] uppercase tracking-widest hover:underline px-4 py-2 bg-[#ff5e00]/10 rounded-lg transition-colors"
            >
              Start Transmission
            </Link> 
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionDashboard;
