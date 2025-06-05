import { createAsyncThunk } from "@reduxjs/toolkit";
import UsersRepository from "../UsersRepository";
import { handleThunkError } from "../../../../core/hooks/captureErrors";
import { UserCreate, UserFilter, UserUpdate } from "task-craft-models";

const usersRepository = new UsersRepository();

export const getUsersThunk = createAsyncThunk(
  "/users/",
  async (userFilters: UserFilter, { rejectWithValue }) => {
    try {
      const response = await usersRepository.getUsers(userFilters);
      return response;
    } catch (error) {
      return handleThunkError(
        error,
        rejectWithValue,
        "Error al obtener los usuarios de la base de datos."
      );
    }
  }
);

export const getUserByIdThunk = createAsyncThunk(
  "/users/getUserById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await usersRepository.getUserById(id);
      return response;
    } catch (error) {
      return handleThunkError(
        error,
        rejectWithValue,
        "Error al obtener el usuario"
      );
    }
  }
);

export const createUserThunk = createAsyncThunk(
  "users/create",
  async (userCreate: UserCreate, { rejectWithValue }) => {
    try {
      await usersRepository.addUser(userCreate);
    } catch (error) {
      return handleThunkError(
        error,
        rejectWithValue,
        "Error al crear el usuario"
      );
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  "users/update",
  async (
    { id, userUpdate }: { id: string; userUpdate: UserUpdate },
    { rejectWithValue }
  ) => {
    try {
      await usersRepository.updateUser(id, userUpdate);
    } catch (error) {
      return handleThunkError(
        error,
        rejectWithValue,
        "Error al actualizar el usuario"
      );
    }
  }
);

export const deleteUserThunk = createAsyncThunk(
  "/users/deleteUser",
  async (id: string, { rejectWithValue }) => {
    try {
      await usersRepository.deleteUser(id);
    } catch (error) {
      return handleThunkError(
        error,
        rejectWithValue,
        "Error al eliminar el usuario"
      );
    }
  }
);
