import { ReduxError } from "../../../../core/interfaces/interfaceErrors";
import { createSlice } from "@reduxjs/toolkit";
import {
  deleteDiaryThunk,
  updateDiaryThunk,
  createDiaryThunk,
  getDiaryByIdThunk,
  getDiariesThunk,
} from "./diariesThunks";
import { DiaryDTO } from "task-craft-models";

interface DiariesState {
  diaries: DiaryDTO[];
  loading: boolean;
  selectedDiary: DiaryDTO | null;
  error: ReduxError;
  crudAction: boolean;
}

const initialState: DiariesState = {
  diaries: [],
  loading: false,
  selectedDiary: null,
  error: null,
  crudAction: false,
};

const diariesSlice = createSlice({
  name: "diaries",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getDiaries
      .addCase(getDiariesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDiariesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.diaries = action.payload;
      })
      .addCase(getDiariesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
      })
      // getDiaryById
      .addCase(getDiaryByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDiaryByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDiary = action.payload;
      })
      .addCase(getDiaryByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
      })
      // THIS WILL BE IMPLEMENTED WITH MIDDLEWARE INSTEAD OF THUNKS
      // THE BACK END WILL CHANGE
      // createDiary
      .addCase(createDiaryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.crudAction = false;
      })
      .addCase(createDiaryThunk.fulfilled, (state) => {
        state.loading = false;
        state.crudAction = true;
      })
      .addCase(createDiaryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
        state.crudAction = false;
      })
      // updateDiary
      .addCase(updateDiaryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.crudAction = false;
      })
      .addCase(updateDiaryThunk.fulfilled, (state) => {
        state.loading = false;
        state.crudAction = true;
      })
      .addCase(updateDiaryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
        state.crudAction = false;
      })
      // deleteDiary
      .addCase(deleteDiaryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.crudAction = false;
      })
      .addCase(deleteDiaryThunk.fulfilled, (state) => {
        state.loading = false;
        state.crudAction = true;
      })
      .addCase(deleteDiaryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
        state.crudAction = false;
      });
  },
});

export const { clearError } = diariesSlice.actions;
export default diariesSlice.reducer;
