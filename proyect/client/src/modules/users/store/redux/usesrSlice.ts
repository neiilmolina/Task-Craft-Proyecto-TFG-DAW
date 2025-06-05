import { ReduxError } from "../../../../core/interfaces/interfaceErrors";
import { createSlice } from "@reduxjs/toolkit";
import {
  deleteUserThunk,
  updateUserThunk,
  createUserThunk,
  getUserByIdThunk,
  getUsersThunk,
} from "./usersThunks";
import { User } from "task-craft-models";

interface UsersState {
  users: User[];
  loading: boolean;
  selectedUser: User | null;
  error: ReduxError;
  crudAction: boolean;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  selectedUser: null,
  error: null,
  crudAction: false,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getUsers
      .addCase(getUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
      })
      // getUserById
      .addCase(getUserByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(getUserByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
      })
      // THIS WILL BE IMPLEMENTED WITH MIDDLEWARE INSTEAD OF THUNKS
      // THE BACK END WILL CHANGE
      // createUser
      .addCase(createUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.crudAction = false;
      })
      .addCase(createUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.crudAction = true;
      })
      .addCase(createUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
        state.crudAction = false;
      })
      // updateUser
      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.crudAction = false;
      })
      .addCase(updateUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.crudAction = true;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
        state.crudAction = false;
      })
      // deleteUser
      .addCase(deleteUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.crudAction = false;
      })
      .addCase(deleteUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.crudAction = true;
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
        state.crudAction = false;
      });
  },
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;
