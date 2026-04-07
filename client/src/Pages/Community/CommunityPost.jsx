import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Heart, MessageCircle, ExternalLink, Clock, TrendingUp, Plus, User } from "lucide-react";
import {
  getAllCommunityPosts,
  toggleLike,
} from "../../features/communityPostSlice";

import SparkButton from "../../components/common/SparkButton";
import { timeAgo } from "../../utils/communityHelpers";

/* ─── Main Component ───────────────────────────────────── */
export default function ForumPostsList() {
  const navigate       = useNavigate();
  const dispatch       = useDispatch();
  const { data, loading } = useSelector((s) => s.communityPost);
  const { token, isAuthenticated, user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(getAllCommunityPosts({ page: 1, limit: 10, category: "community" }));
  }, [dispatch]);

  const handleVote = useCallback((postId) => {
    if (!isAuthenticated) {
      toast.error("Login to like posts ❤️");
      navigate("/login");
      return;
    }
    
    // We pass userId for optimistic Redux update
    const userId = user?._id || user?.user?._id;
    dispatch(toggleLike({ token, postId, userId })).then((result) => {
      if (result.meta.requestStatus !== "fulfilled") {
        toast.error("Couldn't update like, try again");
      }
    });
  }, [isAuthenticated, token, navigate, dispatch, user?._id, user?.user?._id]);

  if (loading && !data?.length) {
    return (
      <div className="max-w-3xl mx-auto p-4 flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-4 animate-pulse bg-white">
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-2.5 bg-gray-100 rounded w-full mb-2" />
            <div className="h-2.5 bg-gray-100 rounded w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 flex flex-col gap-3">

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-white font-black text-xl uppercase tracking-tighter">
          <TrendingUp className="w-6 h-6 text-[#ff5e00]" />
          FEED <span className="text-[#ff5e00]">STREAM</span>
        </div>
        <Link
          to="/community/create"
          className="flex items-center justify-center gap-3 bg-[#ff5e00] hover:bg-[#e65100] text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-900/20 transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Initialize Post
        </Link>
      </div>

      {data?.length > 0 ? (
        <div className="flex flex-col gap-6">
          {data.map((post) => {
            const likes = post.likes || [];
            const currentUserId = user?._id || user?.user?._id;
            const isLiked = currentUserId ? likes.some(id => String(id) === String(currentUserId)) : false;
            const voteCount = likes.length;
            const creator = post.creator?.name || "Unknown";

            return (
              <div
                key={post._id}
                className="group relative bg-[#161616] border border-[#262626] border-b-4 border-b-[#ff5e00] rounded-2xl p-6 transition-all duration-300 hover:bg-[#1e1e1e] flex flex-col"
              >
                {/* Badges */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="px-2 py-0.5 bg-[#262626] text-gray-400 border border-gray-800 rounded text-[10px] font-black uppercase tracking-wider">
                    Community
                  </div>
                  {post.url && (
                    <div className="px-2 py-0.5 bg-yellow-400 text-black rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <ExternalLink size={8} /> Resource
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  {/* Meta */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#262626] rounded-lg flex items-center justify-center text-gray-400 border border-[#333] group-hover:border-[#ff5e00] transition-colors">
                      <User size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white">{creator}</h3>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                        <Clock className="w-3 h-3" />
                        {timeAgo(post.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <Link
                    to={`/community/${post._id}`}
                    className="text-xl font-black text-white hover:text-[#ff5e00] transition-colors line-clamp-2 leading-tight mb-2"
                  >
                    {post.title}
                  </Link>
    
                  {post.shortDescription && (
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-6 font-medium italic">
                      "{post.shortDescription}"
                    </p>
                  )}
                </div>

                {/* Action Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <SparkButton
                      postId={post._id}
                      isLiked={isLiked}
                      voteCount={voteCount}
                      onVote={handleVote}
                    />
                  </div>
                  
                  <Link
                    to={`/community/${post._id}`}
                    className="flex-1 bg-[#262626] text-gray-400 text-center py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#333] hover:text-white transition-all active:scale-95 border border-transparent hover:border-gray-700"
                  >
                    Examine Data
                  </Link>

                  <Link
                    to={`/community/${post._id}`}
                    className="px-4 py-2.5 border border-[#262626] bg-[#0a0a0a] text-gray-500 rounded-lg hover:text-white transition-all flex items-center justify-center"
                  >
                    <MessageCircle size={18} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#161616] rounded-3xl border border-dashed border-[#262626]">
          <Heart className="w-12 h-12 mx-auto mb-3 opacity-20 text-rose-500" />
          <p className="text-lg font-black text-white">No posts yet</p>
          <p className="text-sm text-gray-500 mt-1">Be the first to share something!</p>
          <Link
            to="/community/create"
            className="mt-6 inline-block bg-[#ff5e00] text-white text-xs font-black uppercase tracking-widest px-8 py-3 rounded-xl hover:bg-[#e65100] transition-colors shadow-lg shadow-orange-900/20"
          >
            Create First Post
          </Link>
        </div>
      )}
    </div>
  );
}
