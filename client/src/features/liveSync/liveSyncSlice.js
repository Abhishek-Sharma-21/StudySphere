import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isInCall: false,
  activeRoomId: null, // Stores the ID of the synced colony
};

const liveSyncSlice = createSlice({
  name: "liveSync",
  initialState,
  reducers: {
    setIsInCall: (state, action) => {
      state.isInCall = action.payload;
    },
    setActiveRoomId: (state, action) => {
      state.activeRoomId = action.payload;
    },
    clearCall: (state) => {
      state.isInCall = false;
      state.activeRoomId = null;
    },
    toggleCall: (state) => {
      state.isInCall = !state.isInCall;
    },
  },
});

export const { setIsInCall, setActiveRoomId, clearCall, toggleCall } = liveSyncSlice.actions;

export default liveSyncSlice.reducer;
