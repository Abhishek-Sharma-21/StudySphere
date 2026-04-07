import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { 
  MessageSquare, User, Clock, Plus, Search, 
  TrendingUp, MessageCircle, Heart, Loader,
  ChevronRight, ArrowRight
} from "lucide-react";
import { 
  getAllCommunityPosts, 
  createCommunityPost,
  toggleLike 
} from "../../features/communityPostSlice";
import SparkButton from "../../components/common/SparkButton";
import { timeAgo } from "../../utils/communityHelpers";
import toast from "react-hot-toast";

const DiscussionsIndex = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading } = useSelector((state) => state.communityPost);
  const { token, isAuthenticated, user } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: "", content: "" });

  useEffect(() => {
    dispatch(getAllCommunityPosts({ page: 1, limit: 100, category: "discussion" }));
  }, [dispatch]);

  const handleVote = useCallback((postId) => {
    if (!isAuthenticated) {
      toast.error("Login to participate! ❤️");
      navigate("/login");
      return;
    }
    const userId = user?._id || user?.user?._id;
    dispatch(toggleLike({ token, postId, userId }));
  }, [isAuthenticated, token, navigate, dispatch, user?._id, user?.user?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to start a discussion");
      navigate("/login");
      return;
    }

    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    const postData = {
      title: newDiscussion.title,
      shortDescription: newDiscussion.content.slice(0, 100),
      longDescription: newDiscussion.content,
    };

    const result = await dispatch(createCommunityPost({ token, postData, category: "discussion" }));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Discussion started! 🚀");
      setNewDiscussion({ title: "", content: "" });
      setShowCreateForm(false);
    }
  };

  const filteredDiscussions = data?.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="max-w-7xl mx-auto p-8 flex flex-col gap-10 font-quicksand bg-[#0a0a0a]">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative group">
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#ff5e00] rounded-full group-hover:h-16 transition-all duration-300"></div>
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
             ACADEMIC <span className="text-[#ff5e00]">DISCOURSE</span>
          </h1>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">Live Feed // Multi-threaded knowledge sync</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center justify-center gap-3 bg-[#ff5e00] hover:bg-[#e65100] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-900/20 transition-all active:scale-95"
        >
          {showCreateForm ? <Search className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showCreateForm ? "Browse Discussions" : "Initiate Discussion"}
        </button>
      </div>

      {/* Creation Form / Search Bar Toggle */}
      {showCreateForm ? (
        <div className="bg-[#161616] border border-[#262626] rounded-3xl p-8 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#ff5e00] opacity-50"></div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight mb-8 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-[#ff5e00]" />
            Transmission Configuration
          </h2>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Topic Descriptor</label>
               <input
                 type="text"
                 placeholder="IDENTIFY SUBJECT..."
                 value={newDiscussion.title}
                 onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                 className="w-full p-4 bg-[#0a0a0a] border border-[#262626] rounded-2xl focus:ring-2 focus:ring-[#ff5e00]/30 focus:border-[#ff5e00] text-sm font-bold text-white outline-none placeholder-gray-700 transition-all"
               />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Payload Content</label>
               <textarea
                 placeholder="ELABORATE ON SUBJECT TELEMETRY..."
                 rows="5"
                 value={newDiscussion.content}
                 onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                 className="w-full p-4 bg-[#0a0a0a] border border-[#262626] rounded-2xl focus:ring-2 focus:ring-[#ff5e00]/30 focus:border-[#ff5e00] outline-none text-gray-400 text-sm leading-relaxed placeholder-gray-700 transition-all resize-none"
               />
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-8 py-3 text-gray-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors"
              >
                Abort
              </button>
              <button
                type="submit"
                className="bg-[#ff5e00] text-white px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#e65100] transition-all shadow-xl shadow-orange-900/20 active:scale-95"
              >
                Execute Transmission
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="relative group/search">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/search:text-[#ff5e00] transition-colors" />
          <input
            type="text"
            placeholder="SCAN DISCOURSE DATASET..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-[#161616] border border-[#262626] rounded-[2rem] shadow-xl focus:ring-2 focus:ring-[#ff5e00]/30 focus:border-[#ff5e00] text-xs font-black text-white uppercase tracking-widest outline-none transition-all placeholder-gray-700"
          />
        </div>
      )}

      {/* Discussion List */}
      <div className="flex flex-col gap-4">
        {loading && !filteredDiscussions.length ? (
          <div className="flex flex-col gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-[#161616] animate-pulse rounded-3xl border border-[#262626]" />
            ))}
          </div>
        ) : filteredDiscussions.length > 0 ? (
          filteredDiscussions.map((discussion) => {
            const likes = discussion.likes || [];
            const currentUserId = user?._id || user?.user?._id;
            const isLiked = currentUserId ? likes.some(id => String(id) === String(currentUserId)) : false;
            const creator = discussion.creator?.name || "Anonymous";

            return (
              <div 
                key={discussion._id}
                className="group relative bg-[#161616] border border-[#262626] border-b-4 border-b-[#ff5e00] rounded-2xl p-6 transition-all duration-300 hover:bg-[#1e1e1e] flex flex-col"
              >
                {/* Status Badges */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="px-2 py-0.5 bg-green-500 text-black rounded text-[10px] font-black uppercase tracking-wider">
                    Discussion
                  </div>
                  {likes.length > 5 && (
                    <div className="px-2 py-0.5 bg-yellow-400 text-black rounded text-[10px] font-black uppercase tracking-wider">
                      Hot
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#262626] rounded-lg flex items-center justify-center text-[#ff5e00] border border-[#333]">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white leading-tight group-hover:text-[#ff5e00] transition-colors line-clamp-1">
                        {discussion.title}
                      </h3>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                        BY {creator} · {timeAgo(discussion.createdAt)}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-6 font-medium italic">
                    "{discussion.shortDescription || discussion.longDescription}"
                  </p>
                </div>

                {/* Actions Area */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <SparkButton 
                      postId={discussion._id}
                      isLiked={isLiked}
                      voteCount={likes.length}
                      onVote={handleVote}
                    />
                  </div>
                  <Link 
                    to={`/community/${discussion._id}`}
                    className="flex-1 bg-[#262626] text-gray-400 text-center py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#333] hover:text-white transition-all active:scale-95 border border-transparent hover:border-gray-700"
                  >
                    Examine Node
                  </Link>
                  <button className="px-4 py-2.5 border border-rose-600 bg-rose-600/10 text-rose-500 rounded-lg hover:bg-rose-600 hover:text-white transition-all">
                    <MessageCircle size={18} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-28 bg-[#161616] rounded-[3rem] border border-dashed border-[#262626] flex flex-col items-center">
            <div className="w-24 h-24 bg-[#0a0a0a] rounded-[2rem] shadow-inner flex items-center justify-center mb-10 border border-[#262626]">
               <MessageSquare className="w-10 h-10 text-gray-700" />
            </div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Quiet Sector</h3>
            <p className="text-gray-500 max-w-sm mt-2 mb-10 text-[10px] font-black uppercase tracking-widest">No active discourse streams detected. Be the pioneer and initiate the first academic exchange.</p>
            <button
               onClick={() => setShowCreateForm(true)}
               className="bg-[#ff5e00] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#e65100] transition-all shadow-xl shadow-orange-900/20 active:scale-95 flex items-center gap-3"
            >
              <Plus className="w-5 h-5" /> Initiate First Stream
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionsIndex;
