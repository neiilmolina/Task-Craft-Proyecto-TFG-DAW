import { createSlice } from "@reduxjs/toolkit";
import {
  loginThunk,
  registerThunk,
  logoutThunk,
  getAuthenticatedUserThunk,
  protectedThunk,
} from "./authThunks";
import { UserToken } from "task-craft-models";
import { ReduxError } from "../../../../core/interfaces/interfaceErrors";

interface AuthState {
  user: UserToken | null;
  loading: boolean;
  error: ReduxError;
  isProtected: boolean | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isProtected: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // register
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
      })
      // getAuthenticatedUser
      .addCase(getAuthenticatedUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(getAuthenticatedUserThunk.rejected, (state, action) => {
        state.error = action.payload as ReduxError;
        state.user = null;
      })
      //protected
      .addCase(protectedThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(protectedThunk.fulfilled, (state) => {
        state.loading = false;
        state.isProtected = true; // Acceso permitido
      })
      .addCase(protectedThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
        state.isProtected = false; // Acceso denegado
      })
      // logout
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
