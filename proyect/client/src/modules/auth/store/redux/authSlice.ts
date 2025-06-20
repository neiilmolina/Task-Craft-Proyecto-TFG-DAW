import { createSlice } from "@reduxjs/toolkit";
import {
  loginThunk,
  registerThunk,
  logoutThunk,
  getAuthenticatedUserThunk,
  protectedThunk,
  changePasswordThunk,
  changeEmailThunk,
  changeUserNameThunk,
  deleteThunk,
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
      .addCase(protectedThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isProtected = action.payload;
      })
      .addCase(protectedThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
        state.isProtected = false;
      })
      // logout
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isProtected = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
      })
      // changePassword
      .addCase(changePasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isProtected = null;
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
      })
      // changeEmail
      .addCase(changeEmailThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeEmailThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isProtected = null;
      })
      .addCase(changeEmailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
      })
      // changeUserName
      .addCase(changeUserNameThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeUserNameThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload as UserToken;
        state.isProtected = null;
      })
      .addCase(changeUserNameThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
      })
      // delete
      .addCase(deleteThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isProtected = null;
      })
      .addCase(deleteThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
      })
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
