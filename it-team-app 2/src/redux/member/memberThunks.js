import { createAsyncThunk } from "@reduxjs/toolkit";
import { getItem } from "../../services/Service.js";

export const fetchMember = createAsyncThunk(
  "member/fetchMember",
  async (id, { rejectWithValue }) => {
    try {
      const member = await getItem(id);
      return member;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load member");
    }
  }
);