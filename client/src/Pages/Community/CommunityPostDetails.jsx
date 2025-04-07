import { useParams } from "react-router-dom";

const CommunityPostDetails = () => {
  const { postId } = useParams(); // 🚀 get postId from URL

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Post Details</h1>

      <p>Post ID: {postId}</p>
      {/* Later you can fetch post details using this postId */}
    </div>
  );
};

export default CommunityPostDetails;
