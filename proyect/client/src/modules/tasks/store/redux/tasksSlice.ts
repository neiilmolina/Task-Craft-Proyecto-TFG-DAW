import { TaskDTO } from "task-craft-models";
import { ReduxError } from "../../../../core/interfaces/interfaceErrors";
import { createSlice } from "@reduxjs/toolkit";
import { getTasksThunk } from "./tasksThunks";

interface TasksState {
  tasks: TaskDTO[];
  loading: boolean;
  error: ReduxError;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
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
      });
  },
});

export const { clearError } = tasksSlice.actions;
export default tasksSlice.reducer;
