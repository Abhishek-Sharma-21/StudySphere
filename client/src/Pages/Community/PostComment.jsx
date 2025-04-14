import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const PostComment = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.communityPost);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() === "") return;

    setComments((prev) => [...prev, comment]);
    setComment("");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>

      {/* Comments show here */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-6">
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first!</p>
        ) : (
          comments.map((c, index) => (
            <div key={index} className="p-4 bg-gray-100 rounded-xl">
              {c}
            </div>
          ))
        )}
      </div>

      {/* Input at the bottom */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border rounded-xl p-2 resize-none   focus:ring-blue-400"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          type="submit"
          className="self-end bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
};

export default PostComment;
