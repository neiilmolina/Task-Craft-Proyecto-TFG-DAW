import { TaskDTO } from "task-craft-models";
import { ReduxError } from "../../../../core/interfaces/interfaceErrors";
import { createSlice } from "@reduxjs/toolkit";
import { getTaskByIdThunk, getTasksThunk } from "./tasksThunks";

interface TasksState {
  tasks: TaskDTO[];
  loading: boolean;
  selectedTask: TaskDTO | null;
  error: ReduxError;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  selectedTask: null,
  error: null,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasksThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTasksThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(getTasksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
      })
      .addCase(getTaskByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTaskByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTask = action.payload;
      })
      .addCase(getTaskByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
      });
  },
});

export const { clearError } = tasksSlice.actions;
export default tasksSlice.reducer;
