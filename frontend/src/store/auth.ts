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
    balance: 0,
    address: null,
    transactions: [],
    coverages: [],
    claims: 0,
    notifications: 0,
  },
};

export const loadUser = createAsyncThunk("loadUser", async () => {
  const res = await api.get<any>("/auth");
  return res.data;
});

export const loadNotifications = createAsyncThunk(
  "loadNotifications",
  async (noti_api: any) => {
    const res = await api.get<any>("/auth/notifications");
    return { data: res.data, api: noti_api };
  }
);

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
      state.user = action.payload.user;
      if (state.user.role === "customer") {
        state.user.coverages = action.payload.active_coverages;
        state.user.claims = action.payload.claims;
        state.user.balance = action.payload.balance;
        state.user.transactions = action.payload.transaction_histories;
      }
      state.user.notifications = action.payload.notifications;
    });
    builder.addCase(loadUser.rejected, (state, action) => {});
    builder.addCase(loadNotifications.pending, (state, action) => {});
    builder.addCase(
      loadNotifications.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.user.notifications = 0;
        action.payload.data.map((msg: any) => {
          console.log(msg);

          action.payload.api.open({
            message: msg.title,
            description: msg.content,
            duration: 0,
          });
        });
      }
    );
    builder.addCase(loadNotifications.rejected, (state, action) => {});
  },
});

export const { logOut } = authSlice.actions;

export default authSlice.reducer;
