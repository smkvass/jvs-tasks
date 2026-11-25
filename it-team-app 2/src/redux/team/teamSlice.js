import { createSlice } from "@reduxjs/toolkit";

import {
  fetchTeam,
  addTeamMember,
  editTeamMember,
  removeTeamMember,
} from "./teamThunks.js";

const teamSlice = createSlice({
  name: "team",

  initialState: {
    items: [],
    isCached: false,
    total: 0,
    page: 1,
    limit: 3,
    totalPages: 0,

    status: "idle",
    error: null,
    currentRequestId: null,

    mutationStatus: "idle",
    mutationError: null,
  },

  reducers: {
    clearTeamError(state) {
      state.error = null;
      state.mutationError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Получение списка участников
      .addCase(fetchTeam.pending, (state, action) => {
        state.status = "loading";
        state.error = null;

        state.currentRequestId = action.meta.requestId;
      })

      .addCase(fetchTeam.fulfilled, (state, action) => {
        // Игнорируем устаревший ответ
        if (state.currentRequestId !== action.meta.requestId) {
          return;
        }

        state.status = "succeeded";

        state.items = action.payload.data;
        state.isCached = Boolean(action.payload.isCached);
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;

        state.currentRequestId = null;
      })

      .addCase(fetchTeam.rejected, (state, action) => {
        // Игнорируем ошибку устаревшего запроса
        if (state.currentRequestId !== action.meta.requestId) {
          return;
        }

        state.status = "failed";
        state.error = action.payload || action.error.message;

        state.currentRequestId = null;
      })

      // Создание участника
      .addCase(addTeamMember.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })

      .addCase(addTeamMember.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";

        state.items.push(action.payload);
        state.total += 1;
      })

      .addCase(addTeamMember.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.payload || action.error.message;
      })

      // Редактирование участника
      .addCase(editTeamMember.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })

      .addCase(editTeamMember.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";

        state.items = state.items.map((item) =>
          item.id === action.payload.id
            ? action.payload
            : item
        );
      })

      .addCase(editTeamMember.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.payload || action.error.message;
      })

      // Удаление участника
      .addCase(removeTeamMember.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })

      .addCase(removeTeamMember.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";

        state.items = state.items.filter(
          (item) => item.id !== action.payload.id
        );

        state.total = Math.max(0, state.total - 1);
      })

      .addCase(removeTeamMember.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.payload || action.error.message;
      });
  },
});

export const { clearTeamError } = teamSlice.actions;

export default teamSlice.reducer;
