import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllQuizzesAPI, getQuizByIdAPI } from "./quizAPI";
import { Quiz, QuizState } from "./types";

const initialState: QuizState = {
  quizzes: [],
  loading: false,
  error: null,
};

export const getAllQuizzes = createAsyncThunk(
  "quiz/getAllQuizzes",
  async () => {
    return await getAllQuizzesAPI();
  },
);

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllQuizzes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      .addCase(getAllQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch quizzes";
      });
  },
});

export default quizSlice.reducer;
