
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getItemsList,
  getCachedDashboardList,
} from "../../services/Service.js";

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      // Если нет интернета, используем кэш
      if (!navigator.onLine) {
        const cachedData = getCachedDashboardList();

        if (cachedData) {
          return cachedData;
        }

        return rejectWithValue("No internet connection and no cached data");
      }

      // Пытаемся получить актуальные данные
      const result = await getItemsList("limit=1000");

      return result.data;
    } catch (error) {
      // Если запрос завершился ошибкой, используем кэш
      const cachedData = getCachedDashboardList();

      if (cachedData) {
        return cachedData;
      }

      return rejectWithValue(
        error.message || "Failed to load dashboard data"
      );
    }
  }
);
