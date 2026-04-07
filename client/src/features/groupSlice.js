import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getAllGroups = createAsyncThunk(
  "groups/getAllGroups",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/groups`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || "Failed to fetch groups");
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const getGroupById = createAsyncThunk(
  "groups/getGroupById",
  async (groupId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/groups/${groupId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || "Failed to fetch group");
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const createGroup = createAsyncThunk(
  "groups/createGroup",
  async ({ token, groupData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/groups/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(groupData),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || "Failed to create group");
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const joinGroup = createAsyncThunk(
  "groups/joinGroup",
  async ({ token, groupId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/groups/join/${groupId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || "Failed to join group");
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const leaveGroup = createAsyncThunk(
  "groups/leaveGroup",
  async ({ token, groupId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/groups/leave/${groupId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || "Failed to leave group");
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const requestToJoin = createAsyncThunk(
  "groups/requestToJoin",
  async ({ token, groupId, requestData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/groups/${groupId}/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || "Failed to submit request");
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const handleRequest = createAsyncThunk(
  "groups/handleRequest",
  async ({ token, groupId, requestId, action }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/groups/${groupId}/requests/${requestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || "Failed to handle request");
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const toggleLiveStatus = createAsyncThunk(
  "groups/toggleLiveStatus",
  async ({ token, groupId, admissionMode }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/groups/${groupId}/toggle-live`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ admissionMode }),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || "Failed to toggle live status");
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);


export const removeMember = createAsyncThunk(
  "groups/removeMember",
  async ({ token, groupId, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/groups/${groupId}/members/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || "Failed to remove member");
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const deleteGroup = createAsyncThunk(
  "groups/deleteGroup",
  async ({ token, groupId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/groups/${groupId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || "Failed to delete group");
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);
export const uploadResource = createAsyncThunk(
  "groups/uploadResource",
  async ({ token, groupId, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/api/groups/${groupId}/resources/upload`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || "Upload failed");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteResource = createAsyncThunk(
  "groups/deleteResource",
  async ({ token, groupId, resourceId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/groups/${groupId}/resources/${resourceId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || "Delete failed");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const initialState = {
  groups: [],
  loading: false,
  error: null,
  success: false,
};

const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    resetGroupState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    syncGroup: (state, action) => {
      const updatedGroup = action.payload;
      state.groups = state.groups.map((g) =>
        String(g._id) === String(updatedGroup._id) ? updatedGroup : g
      );
    },
    syncGroupLiveStatus: (state, action) => {
      const { groupId, isLive, liveParticipants } = action.payload;
      state.groups = state.groups.map((g) =>
        String(g._id) === String(groupId) 
          ? { ...g, isLive, liveParticipants } 
          : g
      );
    },


  },
  extraReducers: (builder) => {
    builder
      // Get all groups
      .addCase(getAllGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(getAllGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get single group
      .addCase(getGroupById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGroupById.fulfilled, (state, action) => {
        state.loading = false;
        const updatedGroup = action.payload;
        const index = state.groups.findIndex((g) => g._id === updatedGroup._id);
        if (index !== -1) {
          state.groups[index] = updatedGroup;
        } else {
          state.groups.push(updatedGroup);
        }
      })
      .addCase(getGroupById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create group
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groups.unshift(action.payload);
        state.success = true;
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Join group
      .addCase(joinGroup.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.groups = state.groups.map((g) =>
          g._id === updatedGroup._id ? updatedGroup : g
        );
      })
      // Leave group
      .addCase(leaveGroup.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.groups = state.groups.map((g) =>
          g._id === updatedGroup._id ? updatedGroup : g
        );
      })
      // Request to Join
      .addCase(requestToJoin.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.groups = state.groups.map((g) =>
          g._id === updatedGroup._id ? updatedGroup : g
        );
      })
      // Handle Request

      .addCase(handleRequest.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.groups = state.groups.map((g) =>
          g._id === updatedGroup._id ? updatedGroup : g
        );
      })
      // Toggle Live
      .addCase(toggleLiveStatus.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.groups = state.groups.map((g) =>
          g._id === updatedGroup._id ? updatedGroup : g
        );
      })
      // Remove Member
      .addCase(removeMember.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.groups = state.groups.map((g) =>
          g._id === updatedGroup._id ? updatedGroup : g
        );
      })
      // Delete Group
      .addCase(deleteGroup.fulfilled, (state, action) => {
        const { groupId } = action.payload;
        state.groups = state.groups.filter((g) => g._id !== groupId);
      })
      // Repository Thunks
      .addCase(uploadResource.fulfilled, (state, action) => {
         const updatedGroup = action.payload.group;
         state.groups = state.groups.map(g => String(g._id) === String(updatedGroup._id) ? updatedGroup : g);
      })
      .addCase(deleteResource.fulfilled, (state, action) => {
         const updatedGroup = action.payload.group;
         state.groups = state.groups.map(g => String(g._id) === String(updatedGroup._id) ? updatedGroup : g);
      });


  },
});

export const { resetGroupState, syncGroup, syncGroupLiveStatus } = groupSlice.actions;


export default groupSlice.reducer;
