import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import PostComment from "./PostComment";
import SparkButton from "../../components/common/SparkButton";
import { toggleLike, getPostById } from "../../features/communityPostSlice";
import { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { User, Share2 } from "lucide-react";

const CommunityPostDetails = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, postLoading } = useSelector((state) => state.communityPost);
  const { token, isAuthenticated, user } = useSelector((state) => state.auth);

  // We find from 'data' because getPostById and toggleLike update it
  const post = data?.find((p) => String(p._id) === postId);

  // Fetch post if missing or on refresh
  useEffect(() => {
    if (postId) {
      dispatch(getPostById(postId));
    }
  }, [dispatch, postId]);

  const handleVote = useCallback(() => {
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
  }, [isAuthenticated, token, navigate, dispatch, postId, user?._id, user?.user?._id]);

  if (postLoading && !post) {
    return (
      <div className="max-w-4xl mx-auto p-10 animate-pulse">
        <div className="h-10 bg-[#161616] border border-[#262626] rounded-2xl w-3/4 mb-6 shadow-xl" />
        <div className="h-4 bg-[#111] rounded-lg w-1/4 mb-10" />
        <div className="space-y-4">
           <div className="h-4 bg-[#161616] rounded-lg w-full" />
           <div className="h-4 bg-[#161616] rounded-lg w-5/6" />
           <div className="h-4 bg-[#161616] rounded-lg w-4/6" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[500px] bg-[#0a0a0a] font-quicksand">
        <div className="w-24 h-24 bg-[#161616] rounded-[2rem] border border-[#262626] flex items-center justify-center mb-8 shadow-inner">
           <User size={40} className="text-gray-700" />
        </div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Post Not Found</h1>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-10">The requested transmission node is offline or restricted.</p>
        <button
          onClick={() => navigate("/community")}
          className="bg-[#262626] text-gray-400 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#333] hover:text-white transition-all border border-transparent hover:border-gray-700"
        >
          Return to Feed Segment
        </button>
      </div>
    );
  }

  const likes = post.likes || [];
  const currentUserId = user?._id || user?.user?._id;
  const isLiked = currentUserId ? likes.some(id => String(id) === String(currentUserId)) : false;
  const voteCount = likes.length;

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 font-quicksand">
      {/* Detail Card */}
      <div className="bg-[#161616] border border-[#262626] border-b-4 border-b-[#ff5e00] rounded-3xl p-10 shadow-2xl overflow-hidden relative group">
        {/* Decorative Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff5e00]/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-[#ff5e00]/10 transition-all duration-700"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="px-3 py-1 bg-[#ff5e00] text-white rounded-lg text-[10px] font-black uppercase tracking-[0.2em]">
              {post.category || "Community"}
            </div>
            <div className="h-px bg-[#262626] flex-1"></div>
          </div>

          <h1 className="text-4xl font-black mb-6 text-white leading-tight tracking-tight">
            {post.title}
          </h1>
  
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-[#262626] rounded-2xl flex items-center justify-center text-gray-500 border border-[#333]">
              <User size={24} />
            </div>
            <div>
              <p className="font-black text-gray-300 text-sm">By {post.creator?.name || "Member"}</p>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">{formattedDate}</p>
            </div>
          </div>
  
          {post.shortDescription && (
            <div className="relative mb-8 pl-6 border-l-4 border-[#ff5e00]/30 py-2">
              <p className="text-xl text-gray-400 font-bold italic leading-relaxed">
                "{post.shortDescription}"
              </p>
            </div>
          )}

          <div className="text-lg text-gray-300 leading-relaxed mb-12 whitespace-pre-wrap font-medium">
            {post.longDescription}
          </div>
  
          {/* Action Footer */}
          <div className="flex items-center justify-between pt-8 border-t border-[#262626]">
            <div className="flex items-center gap-6">
              <SparkButton
                postId={post._id}
                isLiked={isLiked}
                voteCount={voteCount}
                onVote={handleVote}
              />
              <div className="hidden md:flex items-center gap-3 text-gray-500 text-sm font-bold bg-[#0a0a0a] px-4 py-2 rounded-xl border border-[#262626]">
                <Share2 size={16} />
                Share Post
              </div>
            </div>
            
            <button className="text-xs font-black text-[#ff5e00] uppercase tracking-widest hover:underline">
              Flag Content
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#0f0f0f] rounded-3xl p-2">
         <PostComment postId={postId} />
      </div>
    </div>
  );
};

export default CommunityPostDetails;
