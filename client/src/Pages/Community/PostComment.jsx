import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MessageCircle, Send, User, Clock, MoreVertical, Edit2, Trash2, X, Check } from "lucide-react";
import { addComment, getCommentsByPost, deleteComment, updateComment } from "../../features/communityPostSlice";

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const PostComment = ({ postId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { comments, commentsLoading } = useSelector((state) => state.communityPost);
  const { token, isAuthenticated, user } = useSelector((state) => state.auth);
  const [comment, setComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const currentUserId = user?._id || user?.user?._id;

  // Load comments from DB on mount / when postId changes
  useEffect(() => {
    if (postId) {
      dispatch(getCommentsByPost(postId));
    }
  }, [dispatch, postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please log in to comment");
      navigate("/login");
      return;
    }
    if (comment.trim() === "") return;

    setIsPosting(true);
    try {
      const result = await dispatch(addComment({ token, content: comment.trim(), postId }));
      if (result.meta.requestStatus === "fulfilled") {
        setComment("");
        toast.success("Comment added!");
      } else {
        toast.error(result.payload || "Failed to add comment");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsPosting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      const result = await dispatch(deleteComment({ commentId, token }));
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Comment deleted");
        setMenuOpenId(null);
      } else {
        toast.error(result.payload || "Failed to delete comment");
      }
    }
  };

  const handleEditStart = (c) => {
    setEditingId(c._id);
    setEditValue(c.content);
    setMenuOpenId(null);
  };

  const handleEditSave = async (commentId) => {
    if (editValue.trim() === "") return;
    const result = await dispatch(updateComment({ commentId, content: editValue, token }));
    if (result.meta.requestStatus === "fulfilled") {
      setEditingId(null);
      setEditValue("");
      toast.success("Comment updated");
    } else {
      toast.error(result.payload || "Failed to update comment");
    }
  };

  return (
    <div className="bg-[#161616] border border-[#262626] rounded-3xl p-8 mb-6 shadow-xl">
      {/* Input form - NOW AT TOP */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-10 pb-10 border-b border-[#262626]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-[#ff5e00]/10 rounded-lg flex items-center justify-center text-[#ff5e00] border border-[#ff5e00]/20">
            <MessageCircle size={18} />
          </div>
          <h2 className="font-black text-white uppercase tracking-[0.2em] text-sm">Join the Orbit</h2>
        </div>
        <textarea
          className="w-full bg-[#0a0a0a] border border-[#262626] rounded-2xl p-5 text-gray-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#ff5e00]/50 focus:border-[#ff5e00] transition-all font-medium placeholder-gray-600"
          placeholder={isAuthenticated ? "Share your insights or ask a question..." : "Login to participate in this discussion"}
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={!isAuthenticated || isPosting}
        />
        <div className="flex justify-between items-center mt-2">
           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              Please be respectful to other members
           </p>
           <button
             type="submit"
             disabled={!isAuthenticated || isPosting || comment.trim() === ""}
             className="px-8 py-3 bg-[#ff5e00] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#e65100] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed shadow-lg shadow-orange-900/20 flex items-center gap-2"
           >
             {isPosting ? (
               <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
             ) : (
               <Send className="w-3 h-3" />
             )}
             {isPosting ? "TRANSMITTING..." : "POST TRANSMISSION"}
           </button>
        </div>
      </form>

      {/* Header for comments list */}
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
          Transmissions
          {comments?.length > 0 && (
            <span className="px-2 py-0.5 bg-[#262626] text-white rounded-md text-[10px] font-black">{comments.length}</span>
          )}
        </h2>
        <div className="h-px bg-[#262626] flex-1"></div>
      </div>

      {/* Comment list */}
      <div className="space-y-6">
        {commentsLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse bg-[#0a0a0a] border border-[#262626] rounded-2xl p-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#262626]" />
                  <div className="flex-1 space-y-3">
                    <div className="h-3 bg-[#262626] rounded w-1/4" />
                    <div className="h-2 bg-[#202020] rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !comments || comments.length === 0 ? (
          <div className="text-center py-16 bg-[#0a0a0a] rounded-3xl border border-dashed border-[#262626]">
            <div className="w-16 h-16 bg-[#161616] rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-600 border border-[#262626]">
              <MessageCircle size={32} />
            </div>
            <p className="text-sm font-black text-gray-500 uppercase tracking-widest">No transmissions found in this sector</p>
          </div>
        ) : (
          [...(comments || [])].reverse().map((c) => (
            <div key={c._id} className="bg-[#0a0a0a] border border-[#262626] rounded-2xl p-6 transition-all hover:bg-[#111] hover:border-[#ff5e00]/30 group/item">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#161616] border border-[#262626] text-[#ff5e00] flex items-center justify-center flex-shrink-0 text-xs font-black shadow-sm group-hover/item:border-[#ff5e00]/50 transition-colors">
                  {c.creator?.name
                    ? c.creator.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                    : <User className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-white">
                        {c.creator?.name || "Anonymous User"}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                        <Clock className="w-3 h-3" />
                        {timeAgo(c.createdAt)}
                      </div>
                    </div>

                    {/* Three dot menu for creator */}
                    {currentUserId && String(c.creator?._id || c.creator) === String(currentUserId) && (
                      <div className="relative">
                        <button 
                          onClick={() => setMenuOpenId(menuOpenId === c._id ? null : c._id)}
                          className="p-1 px-2 text-gray-500 hover:text-white hover:bg-[#262626] rounded-lg transition-colors border border-transparent hover:border-[#333]"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {menuOpenId === c._id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setMenuOpenId(null)} 
                            />
                            <div className="absolute right-0 top-full mt-2 bg-[#161616] border border-[#262626] rounded-xl shadow-2xl py-2 w-32 z-20 overflow-hidden">
                              <button
                                onClick={() => handleEditStart(c)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-[#ff5e00] hover:text-white transition-colors"
                              >
                                <Edit2 className="w-3 h-3" /> Edit
                              </button>
                              <button
                                onClick={() => handleDelete(c._id)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-600 hover:text-white transition-colors"
                              >
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content Or Edit form */}
                  {editingId === c._id ? (
                    <div className="mt-4 bg-[#161616] p-4 rounded-xl border border-[#ff5e00]/30">
                      <textarea 
                        className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg p-3 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#ff5e00] transition font-medium"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        rows={3}
                        autoFocus
                      />
                      <div className="flex justify-end gap-3 mt-4">
                        <button 
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleEditSave(c._id)}
                          className="px-5 py-2 text-[10px] font-black uppercase tracking-widest bg-[#ff5e00] text-white rounded-lg shadow-lg shadow-orange-900/20 transition"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 leading-relaxed break-words whitespace-pre-wrap font-medium">
                      {c.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostComment;
