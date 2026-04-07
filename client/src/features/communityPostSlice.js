import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "http://localhost:3000";

// Async thunk for creating a new community post
export const createCommunityPost = createAsyncThunk(
  "communityPosts/createCommunityPost",
  async (body, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/posts/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${body.token}`,
        },
        body: JSON.stringify({ ...body.postData, category: body.category }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to create post");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Async thunk for getting all community posts
export const getAllCommunityPosts = createAsyncThunk(
  "communityPosts/getAllCommunityPosts",
  async (body, { rejectWithValue }) => {
    try {
      const page = body?.page || 1;
      const limit = body?.limit || 10;
      const category = body?.category || "";
      const url = `${API_URL}/api/posts?page=${page}&limit=${limit}${category ? `&category=${category}` : ""}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch posts");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Async thunk for getting a single post by ID
export const getPostById = createAsyncThunk(
  "communityPosts/getPostById",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/posts/${postId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch post");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Async thunk for like/unlike a post
export const toggleLike = createAsyncThunk(
  "communityPosts/toggleLike",
  async (body, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/posts/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${body.token}`,
        },
        body: JSON.stringify({ postId: body.postId }),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to like/unlike post");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Async thunk to fetch comments for a post from DB
export const getCommentsByPost = createAsyncThunk(
  "communityPosts/getCommentsByPost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/comments/${postId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch comments");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Async thunk for adding a comment on a post
export const addComment = createAsyncThunk(
  "communityPosts/addComment",
  async (body, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${body.token}`,
        },
        body: JSON.stringify({ content: body.content, postId: body.postId }),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to add comment");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Async thunk for deleting a comment
export const deleteComment = createAsyncThunk(
  "communityPosts/deleteComment",
  async ({ commentId, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/delete-comment/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to delete comment");
      }
      return { commentId, message: data.message };
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Async thunk for updating a comment
export const updateComment = createAsyncThunk(
  "communityPosts/updateComment",
  async ({ commentId, content, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/update-comment/${commentId}`, {
        method: "POST", // The backend route uses POST for update
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to update comment");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Async thunk for getting all liked posts of current user
export const getLikedPosts = createAsyncThunk(
  "communityPosts/getLikedPosts",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/posts/liked`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch liked posts");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Async thunk for updating a community post
export const updateCommunityPost = createAsyncThunk(
  "communityPosts/updateCommunityPost",
  async ({ postId, postData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/posts/update/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to update post");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Async thunk for deleting a community post
export const deleteCommunityPost = createAsyncThunk(
  "communityPosts/deleteCommunityPost",
  async ({ postId, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/posts/delete/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to delete post");
      }
      return { postId, message: data.message };
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);


// Initial state
const initialState = {
  data: [],
  loading: false,
  error: null,
  success: false,
  message: "",
  comments: [],
  commentsLoading: false,
  post: null,
  postLoading: false,
  likedPosts: [],
  likedPostsLoading: false,
};

// Community Post Slice
const communityPostSlice = createSlice({
  name: "communityPost",
  initialState,
  reducers: {
    syncNewPost: (state, action) => {
      const exists = state.data.some(p => String(p._id) === String(action.payload._id));
      if (!exists) {
        state.data.unshift(action.payload);
      }
    },
    syncNewComment: (state, action) => {
      const newComment = action.payload;
      const exists = state.comments.some(c => String(c._id) === String(newComment._id));
      if (!exists) {
        state.comments.push(newComment);
        const postId = String(newComment.postId?._id || newComment.postId);
        state.data = state.data.map(p => 
          String(p._id) === postId 
            ? { ...p, comments: [...(p.comments || []), newComment._id] } 
            : p
        );
        if (state.post && String(state.post._id) === postId) {
          state.post.comments = [...(state.post.comments || []), newComment._id];
        }
      }
    },
    syncPostLiked: (state, action) => {
      const { postId, likes } = action.payload;
      state.data = state.data.map(p => 
        String(p._id) === String(postId) ? { ...p, likes } : p
      );
      if (state.post && String(state.post._id) === String(postId)) {
        state.post.likes = likes;
      }
    },
    syncDeletePost: (state, action) => {
      const { postId } = action.payload;
      state.data = state.data.filter(p => String(p._id) !== String(postId));
      if (state.post && String(state.post._id) === String(postId)) {
        state.post = null;
      }
    },
    syncDeleteComment: (state, action) => {
      const { commentId, postId } = action.payload;
      state.comments = state.comments.filter(c => String(c._id) !== String(commentId));
      state.data = state.data.map(p => {
        if (String(p._id) === String(postId)) {
          return {
            ...p,
            comments: (p.comments || []).filter(id => String(id) !== String(commentId))
          };
        }
        return p;
      });
      if (state.post && String(state.post._id) === String(postId)) {
        state.post.comments = (state.post.comments || []).filter(id => String(id) !== String(commentId));
      }
    }

  },

  extraReducers: (builder) => {
    builder
      .addCase(createCommunityPost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCommunityPost.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data.push(action.payload);
        state.message = "Post created successfully";
      })
      .addCase(createCommunityPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create post";
        state.success = false;
        state.message = action.payload?.message || "Failed to create post";
      })
      .addCase(getAllCommunityPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCommunityPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.posts;
        state.success = true;
        state.message = "Posts fetched successfully";
      })
      .addCase(getAllCommunityPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch posts";
        state.success = false;
        state.message = action.payload?.message || "Failed to fetch posts";
      })
      .addCase(getPostById.pending, (state) => {
        state.postLoading = true;
        state.error = null;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.postLoading = false;
        state.post = action.payload;
        // Also update/upsert into data array for consistency
        const index = state.data.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.data[index] = action.payload;
        } else {
          state.data.push(action.payload);
        }
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.payload || "Failed to fetch post";
      })
      .addCase(toggleLike.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        // Optimistic update
        const { postId, userId } = action.meta.arg;
        if (postId && userId) {
          state.data = state.data.map((post) => {
            if (post._id === postId) {
              const likes = post.likes || [];
              const exists = likes.some(id => String(id) === String(userId));
              return {
                ...post,
                likes: exists 
                  ? likes.filter(id => String(id) !== String(userId))
                  : [...likes, userId]
              };
            }
            return post;
          });
        }
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Sync with backend truth
        state.data = state.data.map((post) =>
          post._id === action.payload.postId
            ? { ...post, likes: action.payload.likes }
            : post
        );
        state.message = action.payload.message || "Post liked/unliked successfully";
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to toggle like";
      })
      // Fetch comments
      .addCase(getCommentsByPost.pending, (state) => {
        state.commentsLoading = true;
        state.error = null;
      })
      .addCase(getCommentsByPost.fulfilled, (state, action) => {
        state.commentsLoading = false;
        state.comments = action.payload;
      })
      .addCase(getCommentsByPost.rejected, (state, action) => {
        state.commentsLoading = false;
        state.error = action.payload || "Failed to fetch comments";
      })
      // Add comment
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const newComment = action.payload;
        state.comments = [...state.comments, newComment];
        
        const cPostId = String(newComment.postId?._id || newComment.postId);

        // Update list view
        state.data = state.data.map((post) => {
          if (String(post._id) === cPostId) {
            const currentComments = post.comments || [];
            if (!currentComments.some(id => String(id) === String(newComment._id))) {
              return { ...post, comments: [...currentComments, newComment._id] };
            }
          }
          return post;
        });

        // Update detail view post
        if (state.post && String(state.post._id) === cPostId) {
          const currentComments = state.post.comments || [];
          if (!currentComments.some(id => String(id) === String(newComment._id))) {
            state.post = { ...state.post, comments: [...currentComments, newComment._id] };
          }
        }
        state.message = "Comment added successfully";
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add comment";
        state.success = false;
      })
      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { commentId } = action.payload;
        // 1. Identify which post this comment belongs to before removing it
        const deletedComment = state.comments.find(c => String(c._id) === String(commentId));
        
        // 2. Remove from local comments array
        state.comments = state.comments.filter(c => String(c._id) !== String(commentId));

        if (deletedComment) {
          const cPostId = String(deletedComment.postId?._id || deletedComment.postId);
          // 3. Sync list view (decrement count by removing ID from array)
          state.data = state.data.map((post) => {
            if (String(post._id) === cPostId) {
              return { 
                ...post, 
                comments: (post.comments || []).filter(id => String(id) !== String(commentId)) 
              };
            }
            return post;
          });
          // 4. Sync detail view post
          if (state.post && String(state.post._id) === cPostId) {
            state.post = { 
              ...state.post, 
              comments: (state.post.comments || []).filter(id => String(id) !== String(commentId)) 
            };
          }
        }
        state.message = "Comment deleted successfully";
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete comment";
      })
      // Update comment
      .addCase(updateComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        // Merge the update into the existing populated comment
        state.comments = state.comments.map(c => 
          String(c._id) === String(updatedComment._id) 
            ? { ...c, content: updatedComment.content } 
            : c
        );
        state.message = "Comment updated successfully";
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.error = action.payload || "Failed to update comment";
      })
      // Get liked posts
      .addCase(getLikedPosts.pending, (state) => {
        state.likedPostsLoading = true;
        state.error = null;
      })
      .addCase(getLikedPosts.fulfilled, (state, action) => {
        state.likedPostsLoading = false;
        state.likedPosts = action.payload;
        state.success = true;
      })
      .addCase(getLikedPosts.rejected, (state, action) => {
        state.likedPostsLoading = false;
        state.error = action.payload || "Failed to fetch liked posts";
      })
      // Update community post
      .addCase(updateCommunityPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCommunityPost.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPost = action.payload;
        state.data = state.data.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        );
        if (state.post && state.post._id === updatedPost._id) {
          state.post = updatedPost;
        }
        state.message = "Post updated successfully";
        state.success = true;
      })
      .addCase(updateCommunityPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update post";
      })
      // Delete community post
      .addCase(deleteCommunityPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCommunityPost.fulfilled, (state, action) => {
        state.loading = false;
        const { postId } = action.payload;
        state.data = state.data.filter((post) => post._id !== postId);
        if (state.post && state.post._id === postId) {
          state.post = null;
        }
        state.message = "Post deleted successfully";
        state.success = true;
      })
      .addCase(deleteCommunityPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete post";
      });
  },
});


export const { syncNewPost, syncNewComment, syncPostLiked, syncDeletePost, syncDeleteComment } = communityPostSlice.actions;
export default communityPostSlice.reducer;


