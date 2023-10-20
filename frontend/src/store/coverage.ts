import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";

const initialState: CoverageState = {
  coverages: [],
};

export const loadCoverages = createAsyncThunk("loadCoverage", async () => {
  const res = await api.get<any>("/coverage");
  return res.data;
});

export const addCoverage = createAsyncThunk(
  "addCoverage",
  async (data: any) => {
    const res = await api.post<any>("/coverage/add", data);
    return res.data;
  }
);

export const subscribeCoverage = createAsyncThunk(
  "subscribeCoverage",
  async () => {
    const res = await api.post<any>("/coverage/subscribe");
    return res.data;
  }
);

export const coverageSlice = createSlice({
  name: "coverage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadCoverages.pending, (state, action) => {});
    builder.addCase(
      loadCoverages.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.coverages = action.payload;
      }
    );
    builder.addCase(loadCoverages.rejected, (state, action) => {});
    builder.addCase(addCoverage.pending, (state, action) => {});
    builder.addCase(
      addCoverage.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.coverages = [...state.coverages, action.payload];
      }
    );
    builder.addCase(addCoverage.rejected, (state, action) => {});
  },
});

export default coverageSlice.reducer;
