
import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboard } from "./dashboardThunks.js";

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState: {
    items: [],
    status: "idle",
    error: null,
    currentRequestId: null,

    statusFilter: "all",
    selectedPeriod: "all",
  },

  reducers: {
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    },

    setSelectedPeriod(state, action) {
      state.selectedPeriod = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchDashboard.pending, (state, action) => {
        state.status = "loading";
        state.error = null;

        state.currentRequestId = action.meta.requestId;
      })

      
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        
        if (state.currentRequestId !== action.meta.requestId) {
          return;
        }

        state.status = "succeeded";
        state.items = action.payload;

        state.currentRequestId = null;
      })

      
      .addCase(fetchDashboard.rejected, (state, action) => {
        
        if (state.currentRequestId !== action.meta.requestId) {
          return;
        }

        state.status = "failed";
        state.error =
          action.payload || action.error.message;

        state.currentRequestId = null;
      });
  },
});

export const {
  setStatusFilter,
  setSelectedPeriod,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
