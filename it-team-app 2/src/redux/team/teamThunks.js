
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getItemsList,
  getCachedTeamList,
  createItem,
  updateItem,
  deleteItem,
} from "../../services/Service.js";


export const fetchTeam = createAsyncThunk(
  "team/fetchTeam",
  async (query = "", { rejectWithValue }) => {
    try {
      // Если нет интернета, используем сохранённые данные
      if (!navigator.onLine) {
        const cachedData = getCachedTeamList(query);

        if (cachedData) {
          return {
            ...cachedData,
            isCached: true,
          };
        }

        throw new Error("No internet connection and no saved data");
      }

      // Если интернет есть, загружаем актуальные данные
      try {
        return await getItemsList(query);
      } catch (error) {
        // При ошибке пробуем использовать сохранённые данные
        const cachedData = getCachedTeamList(query);

        if (cachedData) {
          return {
            ...cachedData,
            isCached: true,
          };
        }

        throw error;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Создание участника
export const addTeamMember = createAsyncThunk(
  "team/addTeamMember",
  async (data, { rejectWithValue }) => {
    try {
      return await createItem(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Редактирование участника
export const editTeamMember = createAsyncThunk(
  "team/editTeamMember",
  async ({ id, changes }, { rejectWithValue }) => {
    try {
      return await updateItem(id, changes);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Удаление участника
export const removeTeamMember = createAsyncThunk(
  "team/removeTeamMember",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteItem(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
