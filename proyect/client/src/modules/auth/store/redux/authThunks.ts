import { createAsyncThunk } from "@reduxjs/toolkit";
import AuthRepository from "../AuthRepository";
import { UserCreate, UserToken } from "task-craft-models";

const authRepository = new AuthRepository();

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const user = await authRepository.login(credentials);
      return user as UserToken;
    } catch {
      return rejectWithValue("Credenciales inválidas, ${error})");
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (userData: UserCreate, { rejectWithValue }) => {
    try {
      const user = await authRepository.register(userData);
      return user as UserToken;
    } catch {
      return rejectWithValue("Error al registrar usuario, ${error})");
    }
  }
);

export const getAuthenticatedUserThunk = createAsyncThunk(
  "auth/getAuthenticatedUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authRepository.getAuthenticatedUser();
      return user as UserToken;
    } catch {
      return rejectWithValue("No autenticado");
    }
  }
);

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  await authRepository.logout();
});
