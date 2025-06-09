import { createAsyncThunk } from "@reduxjs/toolkit";
import AuthRepository from "../AuthRepository";
import { UserCreate, UserLogin } from "task-craft-models";
import { handleThunkError } from "../../../../core/hooks/captureErrors";
import { ReduxError } from "../../../../core/interfaces/interfaceErrors";

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

export const protectedThunk = createAsyncThunk<
  boolean,
  void,
  { rejectValue: ReduxError }
>("auth/protected", async (_, { rejectWithValue }) => {
  try {
    const isProtected = await authRepository.protected();
    return isProtected;
  } catch (error) {
    return handleThunkError(
      error,
      rejectWithValue,
      "Usuario no tiene permisos"
    );
  }
});

export const logoutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: ReduxError }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await authRepository.logout();
  } catch (error) {
    return handleThunkError(error, rejectWithValue, "Error al cerrar sesión");
  }
});

export const changePasswordThunk = createAsyncThunk(
  "auth/changePassword",
  async (
    {
      newPassword,
      actualPassword,
    }: {
      newPassword: string;
      actualPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      await authRepository.changePassword({
        newPassword,
        actualPassword,
      });
    } catch (error) {
      return handleThunkError(
        error,
        rejectWithValue,
        "Error al cambiar la contraseña"
      );
    }
  }
);

export const changeEmailThunk = createAsyncThunk(
  "auth/changeEmail",
  async (
    { newEmail, actualEmail }: { newEmail: string; actualEmail: string },
    { rejectWithValue }
  ) => {
    try {
      await authRepository.changeEmail({ newEmail, actualEmail });
    } catch (error) {
      return handleThunkError(
        error,
        rejectWithValue,
        "Error al cambiar el email"
      );
    }
  }
);

export const changeUserNameThunk = createAsyncThunk(
  "auth/changeUserName",
  async (
    {
      newUserName,
      actualUserName,
    }: { newUserName: string; actualUserName: string },
    { rejectWithValue }
  ) => {
    try {
      await authRepository.changeUserName({ newUserName, actualUserName });
    } catch (error) {
      return handleThunkError(
        error,
        rejectWithValue,
        "Error al cambiar el email"
      );
    }
  }
);

export const deleteThunk = createAsyncThunk(
  "auth/delete",
  async (credentials: UserLogin, { rejectWithValue }) => {
    try {
      await authRepository.deleteUser(credentials);
    } catch (error) {
      return handleThunkError(error, rejectWithValue, "Credenciales inválidas");
    }
  }
);
