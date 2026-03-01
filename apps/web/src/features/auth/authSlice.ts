import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUserAPI, loginAPI } from "./authAPI";
import { AuthState, LoginDTO, User } from "./types";

const storedUser = localStorage.getItem("user");
let initialUser: User | null = null;

if (storedUser) {
  try {
    initialUser = JSON.parse(storedUser) as User;
  } catch {
    localStorage.removeItem("user");
  }
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: initialUser,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginDTO, { rejectWithValue }) => {
    try {
      const response = await loginAPI(data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Login failed",
      );
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUserAPI();
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch user",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Login failed";
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
