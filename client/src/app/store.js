import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import communityPostReducer from "../features/communityPostSlice";
import groupReducer from "../features/groupSlice";
import liveSyncReducer from "../features/liveSync/liveSyncSlice";
import storage from "redux-persist/lib/storage";

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

// 1. Combine your reducers
const rootReducer = combineReducers({
  auth: authReducer,
  communityPost: communityPostReducer,
  groups: groupReducer,
  liveSync: liveSyncReducer,
});

// 2. Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 3. Pass the persisted reducer into configureStore
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Ignore persist actions
      },
    }),
});

// 4. Create persistor
export const persistor = persistStore(store);

export default store;
