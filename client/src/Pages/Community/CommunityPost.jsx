import { useEffect, useState } from "react";
import { TiArrowUpOutline } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllCommunityPosts,
  toggleLike,
} from "../../features/communityPostSlice";

export default function ForumPostsList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.communityPost);
  const token = useSelector((state) => state.auth.user?.token);

  // State to track likes for each post
  const [likedPosts, setLikedPosts] = useState({});

  // For getting all posts
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      dispatch(getAllCommunityPosts({ token }));
    }
  }, [token, dispatch, navigate]);

  // For liking a post
  const handleLikeButton = (postId) => async () => {
    const body = { token, postId };

    // Optimistically update the liked state
    setLikedPosts((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId], // Toggle the liked state for this post
    }));

    try {
      const result = await dispatch(toggleLike(body));
      if (result.meta.requestStatus !== "fulfilled") {
        // If the action fails, revert the optimistic update
        setLikedPosts((prevState) => ({
          ...prevState,
          [postId]: !prevState[postId], // Revert the change
        }));
        console.log("Failed to update like status");
      }
    } catch (error) {
      console.error("Error during like toggle:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-sm">
      {data?.length > 0 ? (
        data.map((post) => (
          <div
            key={post._id}
            className="border-b border-gray-200 py-6 flex flex-col gap-3"
          >
            {/* Post Title */}
            <Link
              to={`/community/${post._id}`}
              className="text-lg font-semibold text-blue-600 hover:underline"
            >
              {post.title}
            </Link>

            {/* Short Description */}
            <p className="text-gray-700 text-sm">{post.shortDescription}</p>

            {/* Vote & Comment */}
            <div className="flex gap-6 mt-4 text-sm text-gray-600">
              <button
                onClick={handleLikeButton(post._id)}
                className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
              >
                {/* Conditional Arrow Icon with indigo color */}
                <TiArrowUpOutline
                  className={`text-xl h-5 w-5 ${
                    likedPosts[post._id] ? "fill-indigo-600" : ""
                  }`}
                />
                <span>Vote</span>
              </button>

              <button className="transition-colors">Comments</button>
            </div>

            {/* Creator Name & Date */}
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>{post.creator?.name || "Unknown User"}</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">No posts found.</div>
      )}
    </div>
  );
}
