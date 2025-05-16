import { createAsyncThunk } from "@reduxjs/toolkit";
import AuthRepository from "../AuthRepository";
import { UserCreate, UserLogin } from "task-craft-models";
import { handleThunkError } from "../../../../core/hooks/captureErrors";

const authRepository = new AuthRepository();

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials: UserLogin, { rejectWithValue }) => {
    try {
      await authRepository.login(credentials);
    } catch (error) {
      return handleThunkError(error, rejectWithValue, "Credenciales inválidas");
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (userData: UserCreate, { rejectWithValue }) => {
    try {
      await authRepository.register(userData);
    } catch (error) {
      return handleThunkError(
        error,
        rejectWithValue,
        "Error al registrar el usuario"
      );
    }
  }
);

export const getAuthenticatedUserThunk = createAsyncThunk(
  "auth/getAuthenticatedUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authRepository.getAuthenticatedUser();
      return response;
    } catch (error) {
      return handleThunkError(error, rejectWithValue, "Usuario no autenticado");
    }
  }
);

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  await authRepository.logout();
});
