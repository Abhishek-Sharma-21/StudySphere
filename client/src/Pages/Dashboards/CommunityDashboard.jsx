import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdEdit, MdDelete, MdFavorite, MdArticle } from "react-icons/md";
import { getLikedPosts, getAllCommunityPosts, deleteCommunityPost } from "../../features/communityPostSlice";
import { Link } from "react-router-dom";

import { timeAgo } from "../../utils/communityHelpers";
import { EditCommunityPostPath } from "../../components/RouteNames/RouteName";
import toast from "react-hot-toast";

const CommunityDashboard = () => {
  const [activeTab, setActiveTab] = useState("my-posts"); // 'my-posts' or 'liked-posts'
  const dispatch = useDispatch();
  
  const { data, loading, likedPosts, likedPostsLoading } = useSelector((state) => state.communityPost);

  const { token, user } = useSelector((state) => state.auth);
  const currentUserId = user?._id || user?.user?._id;

  useEffect(() => {
    if (token) {
      dispatch(getAllCommunityPosts({ page: 1, limit: 100 }));
      dispatch(getLikedPosts(token));
    }
  }, [dispatch, token]);

  const handleDeletePost = (postId) => {
    if (window.confirm("Are you sure you want to terminate this data packet? This action is irreversible.")) {
      dispatch(deleteCommunityPost({ postId, token })).then((res) => {
        if (deleteCommunityPost.fulfilled.match(res)) {
          toast.success("Transmission Terminated");
        } else {
          toast.error(res.payload || "Termination Failed");
        }
      });
    }
  };


  const myPosts = data?.filter(post => 
    String(post.creator?._id || post.creator) === String(currentUserId)
  ) || [];

  const displayPosts = activeTab === "my-posts" ? myPosts : likedPosts;
  const isListLoading = activeTab === "my-posts" ? loading : likedPostsLoading;

  return (
    <div className="md:col-span-2 font-quicksand bg-[#0a0a0a]">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Community <span className="text-[#ff5e00]">Management</span></h2>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Archive // Operational status active</p>
        </div>
        
        <div className="flex bg-[#161616] p-1.5 rounded-2xl border border-[#262626] shadow-xl w-full lg:w-auto">
          <button
            onClick={() => setActiveTab("my-posts")}
            className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "my-posts" 
                ? "bg-[#ff5e00] text-white shadow-lg shadow-orange-900/40" 
                : "text-gray-500 hover:text-white"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <MdArticle className="w-3.5 h-3.5" />
              My Transmissions
            </div>
          </button>
          <button
            onClick={() => setActiveTab("liked-posts")}
            className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "liked-posts" 
                ? "bg-rose-600 text-white shadow-lg shadow-rose-900/40" 
                : "text-gray-500 hover:text-white"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <MdFavorite className="w-3.5 h-3.5" />
              Synchronized 
            </div>
          </button>
        </div>
      </div>

      <div className="min-h-[400px]">
        {isListLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-[#161616] border border-[#262626] animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : displayPosts?.length > 0 ? (
          <ul className="space-y-4">
            {displayPosts.map((post) => (
              <li 
                key={post._id} 
                className="group/item bg-[#161616] p-5 rounded-2xl border-l-4 border-l-transparent border border-[#262626] shadow-lg hover:border-l-[#ff5e00] hover:bg-[#1a1a1a] transition-all flex justify-between items-center"
              >
                <div className="flex-1 min-w-0 pr-6">
                  <Link 
                    to={`/community/${post._id}`}
                    className="font-black text-gray-200 group-hover/item:text-[#ff5e00] transition-colors truncate block text-sm uppercase tracking-tight"
                  >
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{timeAgo(post.createdAt)}</span>
                    <span className="w-1 h-1 bg-[#262626] rounded-full"></span>
                    <span className="text-[10px] text-[#ff5e00] font-black uppercase tracking-widest bg-[#ff5e00]/10 px-2.5 py-1 rounded-md">
                      {post.likes?.length || 0} PULSE UNITS
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeTab === "my-posts" && (
                    <>
                      <Link 
                        to={EditCommunityPostPath.replace(":postId", post._id)}
                        className="p-2.5 text-gray-500 hover:text-[#ff5e00] hover:bg-[#ff5e00]/10 rounded-xl transition-all border border-transparent hover:border-[#ff5e00]/30 mr-2"
                      >
                        <MdEdit className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDeletePost(post._id)}
                        className="p-2.5 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/30"
                      >
                        <MdDelete className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {activeTab === "liked-posts" && (
                    <div className="px-4 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <MdFavorite className="w-3.5 h-3.5" />
                      Synchronized
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-24 bg-[#161616] rounded-3xl border border-dashed border-[#262626] flex flex-col items-center">
            <div className="w-20 h-20 bg-[#0a0a0a] rounded-2xl flex items-center justify-center mb-6 text-gray-700 border border-[#262626] shadow-inner text-4xl">
              {activeTab === "my-posts" ? <MdArticle /> : <MdFavorite />}
            </div>
            <p className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">
              {activeTab === "my-posts" 
                ? "No transmissions recorded" 
                : "Zero synchronization found"}
            </p>
            <Link
              to="/community/create"
              className="mt-8 text-[10px] font-black text-[#ff5e00] uppercase tracking-widest hover:underline px-8 py-3 bg-[#ff5e00]/10 rounded-xl border border-[#ff5e00]/20 transition-all hover:bg-[#ff5e00] hover:text-white"
            >
              {activeTab === "my-posts" ? "Initiate First Post" : "Explore Community Node"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityDashboard;
