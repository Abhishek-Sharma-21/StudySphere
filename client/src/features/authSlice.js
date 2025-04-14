import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//register User With CreateAsyncThunk
export const SignUp = createAsyncThunk(
  "SignUp",
  async (body, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/api/auth/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Signup failed");
      }
      const data = await response.json();
      console.log("Response Data:", data);
      return data;
    } catch (error) {
      console.error("Error:", error);
      return rejectWithValue(error);
    }
  }
);
//for login
export const signIn = createAsyncThunk(
  "signIn",
  async (body, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Login failed");
      }
      const data = await response.json();
      console.log("Response Data:", data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);
//forgot password
export const forgetPassword = createAsyncThunk(
  "forgetPassword",
  async (body, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Forgot password failed");
      }
      const data = await response.json();
      console.log("Response Data:", data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);
//reset password
export const resetPassword = createAsyncThunk(
  "resetPassword",
  async (body, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/reset-password/${body.token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: body.password }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Reset password failed");
      } else {
        const data = await response.json();
        console.log("Response Data:", data);
        return data;
      }
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);
//for logout
export const logoutUser = createAsyncThunk(
  "logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Logout failed");
      }

      const data = await response.json();
      console.log("Response Data:", data);
      return data; // <- No extra `)` here
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

//Users initial State
const initialState = {
  user: null,
  isLoading: false,
  isError: false,
  errorMessage: "",
  isAuthenticated: false,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true; // Set isAuthenticated to true on login
      state.token = action.payload.token; // Store the token
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null; // Clear the token on logout
    },
    resetError: (state) => {
      state.isError = false;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    // extrareducers for sign up
    builder
      .addCase(SignUp.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
        state.isAuthenticated = false; // Initialize or reset auth state
      })
      .addCase(SignUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.user = action.payload;
        state.token = action.payload.token; // Store the token
        state.errorMessage = "";
        state.isAuthenticated = true; // Set isAuthenticated on successful signup (if you want auto-login)
      })
      .addCase(SignUp.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Something went wrong";
        state.isAuthenticated = false;
      })
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
        state.isAuthenticated = false; // Initialize or reset auth state
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.user = action.payload;
        state.token = action.payload.token; // Store the token
        state.isAuthenticated = true; // <---- SET isAuthenticated TO TRUE ON SUCCESSFUL LOGIN
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Something went wrong";
        state.isAuthenticated = false;
      })
      .addCase(forgetPassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
        // state.isAuthenticated = state.isAuthenticated; // Keep the current auth state
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.user = action.payload;
        state.errorMessage = "";
        // state.isAuthenticated = false; // Keep the current auth state
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Something went wrong";
        // state.isAuthenticated = state.isAuthenticated; // Keep the current auth state
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.user = action.payload;
        state.errorMessage = "";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Something went wrong";
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.token = null;
        state.user = null; // Clear user data on logout
        state.errorMessage = "";
        state.isAuthenticated = false; // Set isAuthenticated to false on logout
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Something went wrong";
        state.isAuthenticated = false; // Keep the current auth state
      })
      .addCase("persist/REHYDRATE", (state) => {
        state.isError = false;
        state.errorMessage = "";
      });
  },
});

export const { login, logout, resetError } = authSlice.actions; // Export the new action
export default authSlice.reducer;
