import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";

const initialState: StatisticState = {
  data: {},
};

export const getStatistics = createAsyncThunk(
  "getStatistics",
  async () => {
    const res = await api.get<any>("/auth/statistics");
    return res.data;
  }
);

export const statisticSlice = createSlice({
  name: "statistic",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStatistics.pending, (state, action) => { });
    builder.addCase(
      getStatistics.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.data = action.payload;
      }
    );
    builder.addCase(getStatistics.rejected, (state, action) => { });
  },
});

export default statisticSlice.reducer;
