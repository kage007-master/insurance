import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";
import { features } from "process";

const initialState: ClaimState = {
  active: [],
  past: [],
  assessed: [],
  assigned: [],
};

export const activeClaims = createAsyncThunk("activeClaims", async () => {
  const res = await api.get<any>("/claim/active");
  return res.data;
});

export const pastClaims = createAsyncThunk("pastClaims", async () => {
  const res = await api.get<any>("/claim/past");
  return res.data;
});

export const assessedClaims = createAsyncThunk("assessedClaims", async () => {
  const res = await api.get<any>("/claim/assessed");
  return res.data;
});

export const assignedClaims = createAsyncThunk("assignedClaims", async () => {
  const res = await api.get<any>("/claim/assigned");
  return res.data;
});

export const feedbackClaims = createAsyncThunk(
  "feedbackClaims",
  async (data: any) => {
    const res = await api.post<any>("/claim/feedback", data);
    return data;
  }
);

export const claimSlice = createSlice({
  name: "claim",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(activeClaims.pending, (state, action) => {});
    builder.addCase(
      activeClaims.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.active = action.payload;
        console.log(state.active);
      }
    );
    builder.addCase(activeClaims.rejected, (state, action) => {});

    builder.addCase(pastClaims.pending, (state, action) => {});
    builder.addCase(
      pastClaims.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.past = action.payload;
      }
    );
    builder.addCase(pastClaims.rejected, (state, action) => {});

    builder.addCase(assessedClaims.pending, (state, action) => {});
    builder.addCase(
      assessedClaims.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.assessed = action.payload;
      }
    );
    builder.addCase(assessedClaims.rejected, (state, action) => {});

    builder.addCase(assignedClaims.pending, (state, action) => {});
    builder.addCase(
      assignedClaims.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.assigned = action.payload;
      }
    );
    builder.addCase(assignedClaims.rejected, (state, action) => {});

    builder.addCase(feedbackClaims.pending, (state, action) => {});
    builder.addCase(
      feedbackClaims.fulfilled,
      (state, action: PayloadAction<any>) => {}
    );
    builder.addCase(feedbackClaims.rejected, (state, action) => {});
  },
});

export default claimSlice.reducer;
