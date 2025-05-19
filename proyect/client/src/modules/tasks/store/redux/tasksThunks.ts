import { createAsyncThunk } from "@reduxjs/toolkit";
import TasksRepository from "../TasksRepository";
import { handleThunkError } from "../../../../core/hooks/captureErrors";
import { TaskFilters } from "task-craft-models";

const tasksRepository = new TasksRepository();

export const getTasksThunk = createAsyncThunk(
  "/tasks/",
  async (taskFilters: TaskFilters, { rejectWithValue }) => {
    try {
      const response = await tasksRepository.getTasks(taskFilters);
      return response;
    } catch (error) {
      return handleThunkError(
        error,
        rejectWithValue,
        "Error al obtener los categorias de la base de datos."
      );
    }
  }
);
