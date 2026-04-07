import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../../context/SocketContext";
import { 
  syncNewPost, 
  syncPostLiked, 
  syncNewComment,
  syncDeletePost,
  syncDeleteComment 
} from "../../features/communityPostSlice";
import { syncGroupLiveStatus } from "../../features/groupSlice";

import toast from "react-hot-toast";

/**
 * NeuralSyncManager - Global real-time state synchronizer.
 * Listens for system-wide socket events and updates the Redux store.
 */
const NeuralSyncManager = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?._id || user?.user?._id;

  useEffect(() => {
    if (socket) {
      // 1. New Post Broadcast
      socket.on("new_post", (post) => {
        const creatorId = post.creator?._id || post.creator;
        // Only sync if not the sender (sender's state is updated by API response)
        if (String(creatorId) !== String(currentUserId)) {
          dispatch(syncNewPost(post));
          toast.success(`New Node Created: ${post.title}`, {
            icon: "🚀",
            style: {
              borderRadius: "1rem",
              background: "#161616",
              color: "#fff",
              border: "1px solid #262626",
              fontSize: "10px",
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            },
          });
        }
      });

      // 2. Post Liked Broadcast
      socket.on("post_liked", (data) => {
        dispatch(syncPostLiked(data));
      });

      // 3. New Comment Broadcast
      socket.on("new_comment", (comment) => {
        const creatorId = comment.creator?._id || comment.creator;
        // Only sync if not the sender (sender's state is updated by API response)
        if (String(creatorId) !== String(currentUserId)) {
          dispatch(syncNewComment(comment));
        }
      });

      // 4. Delete Post Broadcast
      socket.on("delete_post", (data) => {
        dispatch(syncDeletePost(data));
      });

      // 5. Delete Comment Broadcast
      socket.on("delete_comment", (data) => {
        dispatch(syncDeleteComment(data));
      });

      // 6. Global Group Update (Live status, member counts, etc.)
      socket.on("global_group_update", (data) => {
        dispatch(syncGroupLiveStatus(data));
      });

      return () => {
        socket.off("new_post");
        socket.off("post_liked");
        socket.off("new_comment");
        socket.off("delete_post");
        socket.off("delete_comment");
        socket.off("global_group_update");
      };
    }
  }, [socket, dispatch, currentUserId]);


  return null; // This component doesn't render anything
};

export default NeuralSyncManager;
