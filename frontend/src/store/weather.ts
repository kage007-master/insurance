import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";

const initialState: WeatherState = {
  weathers: [],
};

export const getWeatherEvents = createAsyncThunk(
  "getWeatherEvents",
  async () => {
    const res = await api.get<any>("/weather");
    return res.data;
  }
);

export const claimSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getWeatherEvents.pending, (state, action) => {});
    builder.addCase(
      getWeatherEvents.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.weathers = action.payload.reverse();
      }
    );
    builder.addCase(getWeatherEvents.rejected, (state, action) => {});
  },
});

export default claimSlice.reducer;
