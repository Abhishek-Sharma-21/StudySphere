import { useRef, useState, useCallback } from "react";
import { Heart } from "lucide-react";
import { voteTier } from "../../utils/communityHelpers";

/* ─── Like Button (previously SparkButton) ────────────────── */
export default function SparkButton({ postId, isLiked, voteCount, onVote }) {
  const [floats, setFloats]   = useState([]);
  const [heartAnim, setHeartAnim] = useState(false);
  const floatId = useRef(0);
  const tier = voteTier(voteCount);

  const handleClick = useCallback(() => {
    setHeartAnim(false);
    requestAnimationFrame(() => setHeartAnim(true));
    setTimeout(() => setHeartAnim(false), 500);

    if (!isLiked) {
      const id = ++floatId.current;
      setFloats((prev) => [...prev, id]);
      setTimeout(() => setFloats((prev) => prev.filter((f) => f !== id)), 900);
    }
    onVote(postId);
  }, [isLiked, onVote, postId]);

  return (
    <div className="relative flex items-center">
      {/* Floating +1 */}
      {floats.map((id) => (
        <span key={id} className={`like-float ${tier.color} font-bold`}>+1</span>
      ))}

      <button
        onClick={handleClick}
        title={isLiked ? "Unlike this post" : "Like this post!"}
        className={[
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold",
          "transition-all duration-200 focus:outline-none",
          isLiked
            ? "bg-rose-100 text-rose-600 shadow-sm"
            : "bg-gray-100 text-gray-500 hover:bg-rose-50 hover:text-rose-600",
        ].join(" ")}
      >
        <Heart
          className={[
            "w-4 h-4 transition-transform duration-200",
            heartAnim ? "heart-bounce" : "",
            isLiked ? "fill-rose-600 text-rose-600" : "text-gray-500",
          ].join(" ")}
          strokeWidth={isLiked ? 1.5 : 2}
        />
        <span className={isLiked ? "text-rose-600" : "text-gray-600"}>{voteCount}</span>
        {isLiked && voteCount > 0 && (
          <span className="text-[10px] opacity-70 text-rose-500">{tier.label}</span>
        )}
      </button>
    </div>
  );
}
