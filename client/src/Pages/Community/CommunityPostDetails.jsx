import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PostComment from "./PostComment";

const CommunityPostDetails = () => {
  const { postId } = useParams(); // 🚀 Get postId from URL
  const { data } = useSelector((state) => state.communityPost); // 🚀 Get post data from Redux store
  console.log(data);

  const post = data?.find((p) => String(p._id) === postId);
  console.log(post);

  if (!post) {
    return (
      <div className="p-10 flex items-center justify-center min-h-[400px]">
        <h1 className="text-3xl font-bold text-gray-600">Post Not Found</h1>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">{post.title}</h1>

        <div className="flex items-center mb-6 space-x-4 text-sm text-gray-500">
          <p>By {post.creator?.name}</p>
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>{" "}
          {/* a tiny dot between */}
          <p>{formattedDate}</p>
        </div>

        <p className="text-lg text-gray-700 mb-4">{post.shortDescription}</p>
        <p className="text-base text-gray-600 leading-relaxed">
          {post.longDescription}
        </p>
      </div>

      <PostComment />
    </div>
  );
};

export default CommunityPostDetails;
