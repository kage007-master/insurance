import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";

const initialState: ClientState = {
  clients: [],
  client: {},
};

export const loadClients = createAsyncThunk("loadclients", async () => {
  const res = await api.get<any>("/client");
  return res.data;
});

export const loadClient = createAsyncThunk("loadclient", async (id: string) => {
  const res = await api.get<any>(`/client/${id}`);
  return res.data;
});

export const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadClients.pending, (state, action) => {});
    builder.addCase(
      loadClients.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.clients = action.payload.map((client: any) => {
          return { ...client, key: client._id };
        });
      }
    );
    builder.addCase(loadClients.rejected, (state, action) => {});
    builder.addCase(loadClient.pending, (state, action) => {});
    builder.addCase(
      loadClient.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.client = action.payload;
      }
    );
    builder.addCase(loadClient.rejected, (state, action) => {});
  },
});

export default clientSlice.reducer;
