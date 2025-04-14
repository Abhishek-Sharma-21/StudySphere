import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Async thunk for creating a new community post
export const createCommunityPost = createAsyncThunk(
  "communityPosts/createCommunityPost",
  async (body, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${body.token}`,
        },
        body: JSON.stringify(body.postData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API errors
        return rejectWithValue(data.message || "Failed to create post");
      }

      console.log("Response Data:", data);
      return data;
    } catch (error) {
      console.error("Error:", error);
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

//Async thunk for getting all community posts
export const getAllCommunityPosts = createAsyncThunk(
  "communityPosts/getAllCommunityPosts",
  async (body, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${body.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch posts");
      }
      console.log("Response Data:", data);
      return data;
    } catch (error) {
      console.error("Error:", error);
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

//Async thunk for like/unlike a post
export const toggleLike = createAsyncThunk(
  "communityPosts/toggleLike",
  async (body, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/like`, {
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
      console.log("Response Data:", data);
      return data;
    } catch (error) {
      console.error("Error:", error);
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

//Async thunk for add comment on a post
export const addComment = createAsyncThunk(
  "communityPosts/addComment",
  async (body, { rejectWithValue }) => {
    try {
      const respnse = await fetch(`http://localhost:3000/api/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${body.token}`,
        },
      });
      const data = await respnse.json();
      if (!respnse.ok) {
        return rejectWithValue(data.message || "Failed to add comment");
      }
      console.log("Response Data:", data);
      return data;
    } catch (error) {
      console.log(error);
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
};

// Community Post Slice
const communityPostSlice = createSlice({
  name: "communityPost",
  initialState,
  reducers: {},
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
        state.data.push(action.payload); // Add the new post to the array
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
        state.data = action.payload; // Update the posts array with fetched data
        state.success = true;
        state.message = "Posts fetched successfully";
      })
      .addCase(getAllCommunityPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch posts";
        state.success = false;
        state.message = action.payload?.message || "Failed to fetch posts";
      })
      .addCase(toggleLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = state.data.map((post) =>
          post._id === action.payload.postId
            ? { ...post, likes: action.payload.likes }
            : post
        );
        state.message = "Post liked/unliked successfully";
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to like/unlike post";
        state.success = false;
        state.message = action.payload?.message || "Failed to like/unlike post";
      })
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.data.push(action.payload);
        state.data = [...state.data, action.payload];
        state.message = "Comment added successfully";
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add comment";
        state.success = false;
      });
  },
});

export default communityPostSlice.reducer;
