import { createAsyncThunk } from "@reduxjs/toolkit";
import TasksRepository from "../TasksRepository";
import { handleThunkError } from "../../../../core/hooks/captureErrors";
import { TaskCreate, TaskFilters, TaskUpdate } from "task-craft-models";

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
        "Error al obtener las tareas de la base de datos."
      );
    }
  }
);

export const getTaskByIdThunk = createAsyncThunk(
  "/tasks/getTaskById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await tasksRepository.getTaskById(id);
      return response;
    } catch (error) {
      return handleThunkError(
        error,
        rejectWithValue,
        "Error al obtener la tarea"
      );
    }
  }
);

export const createTaskThunk = createAsyncThunk(
  "tasks/create",
  async (taskCreate: TaskCreate, { rejectWithValue }) => {
    try {
      await tasksRepository.addTask(taskCreate);
    } catch (error) {
      return handleThunkError(
        error,
        rejectWithValue,
        "Error al crear la tarea"
      );
    }
  }
);

export const updateTaskThunk = createAsyncThunk(
  "tasks/update",
  async (
    { id, taskUpdate }: { id: string; taskUpdate: TaskUpdate },
    { rejectWithValue }
  ) => {
    try {
      await tasksRepository.updateTask(id, taskUpdate);
    } catch (error) {
      return handleThunkError(
        error,
        rejectWithValue,
        "Error al actualizar la tarea"
      );
    }
  }
);

export const deleteTaskThunk = createAsyncThunk(
  "/tasks/deleteTask",
  async (id: string, { rejectWithValue }) => {
    try {
      await tasksRepository.deleteTask(id);
    } catch (error) {
      return handleThunkError(
        error,
        rejectWithValue,
        "Error al eliminar la tarea"
      );
    }
  }
);
