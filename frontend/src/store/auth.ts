import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";
import setAuthToken from "../utils/setAuthToken";

const initialState: AuthState = {
  token: "",
  user: {
    id: 0,
    username: "",
    fullname: "",
    email: "",
    role: "",
  },
};

export const loadUser = createAsyncThunk("loadUser", async () => {
  const res = await api.get<any>("/auth");
  return res.data;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      setAuthToken("");
      state.token = initialState.token;
      state.user = initialState.user;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadUser.pending, (state, action) => {});
    builder.addCase(loadUser.fulfilled, (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    });
    builder.addCase(loadUser.rejected, (state, action) => {});
  },
});

export const { logOut } = authSlice.actions;

export default authSlice.reducer;
