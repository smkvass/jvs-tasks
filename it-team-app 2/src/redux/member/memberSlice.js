
import { createSlice } from "@reduxjs/toolkit";

import { fetchMember } from "./memberThunks.js";
import { editTeamMember } from "../team/teamThunks.js";

const memberSlice = createSlice({
  name: "member",

  initialState: {
    currentMember: null,

    status: "idle",
    error: null,
    currentRequestId: null,

    updateStatus: "idle",
    updateError: null,
  },

  reducers: {
    clearMember(state) {
      state.currentMember = null;
      state.error = null;
      state.status = "idle";
      state.currentRequestId = null;

      state.updateStatus = "idle";
      state.updateError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      
      .addCase(fetchMember.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.currentMember = null;

        state.currentRequestId = action.meta.requestId;
      })

      .addCase(fetchMember.fulfilled, (state, action) => {
        
        if (state.currentRequestId !== action.meta.requestId) {
          return;
        }

        state.status = "succeeded";
        state.currentMember = action.payload;

        state.currentRequestId = null;
      })

      .addCase(fetchMember.rejected, (state, action) => {
        
        if (state.currentRequestId !== action.meta.requestId) {
          return;
        }

        state.status = "failed";
        state.error =
          action.payload || action.error.message;

        state.currentRequestId = null;
      })

      // Обновление участника
      .addCase(editTeamMember.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })

      .addCase(editTeamMember.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";

        if (state.currentMember?.id === action.payload.id) {
          state.currentMember = action.payload;
        }
      })

      .addCase(editTeamMember.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError =
          action.payload || action.error.message;
      });
  },
});

export const { clearMember } = memberSlice.actions;

export default memberSlice.reducer;
