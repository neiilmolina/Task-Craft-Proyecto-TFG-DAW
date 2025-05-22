import { TaskDTO } from "task-craft-models";
import { ReduxError } from "../../../../core/interfaces/interfaceErrors";
import { createSlice } from "@reduxjs/toolkit";
import {
  deleteTaskThunk,
  updateTaskThunk,
  createTaskThunk,
  getTaskByIdThunk,
  getTasksThunk,
} from "./tasksThunks";

interface TasksState {
  tasks: TaskDTO[];
  loading: boolean;
  selectedTask: TaskDTO | null;
  error: ReduxError;
  crudAction: boolean;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  selectedTask: null,
  error: null,
  crudAction: false,
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
      // getTasks
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
      // getTaskById
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
      })
      // THIS WILL BE IMPLEMENTED WITH MIDDLEWARE INSTEAD OF THUNKS
      // THE BACK END WILL CHANGE
      // createTask
      .addCase(createTaskThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.crudAction = false;
      })
      .addCase(createTaskThunk.fulfilled, (state) => {
        state.loading = false;
        state.crudAction = true;
      })
      .addCase(createTaskThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
        state.crudAction = false;
      })
      // updateTask
      .addCase(updateTaskThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.crudAction = false;
      })
      .addCase(updateTaskThunk.fulfilled, (state) => {
        state.loading = false;
        state.crudAction = true;
      })
      .addCase(updateTaskThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
        state.crudAction = false;
      })
      // deleteTask
      .addCase(deleteTaskThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.crudAction = false;
      })
      .addCase(deleteTaskThunk.fulfilled, (state) => {
        state.loading = false;
        state.crudAction = true;
      })
      .addCase(deleteTaskThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
        state.crudAction = false;
      });
  },
});

export const { clearError } = tasksSlice.actions;
export default tasksSlice.reducer;
