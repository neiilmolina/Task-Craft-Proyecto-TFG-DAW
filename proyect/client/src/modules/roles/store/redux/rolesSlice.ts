import { ReduxError } from "../../../../core/interfaces/interfaceErrors";
import { createSlice } from "@reduxjs/toolkit";
import { getRolesThunk } from "./rolesThunks";
import { Role } from "task-craft-models";

interface RolesState {
  roles: Role[] | null;
  loading: boolean;
  error: ReduxError;
}

const initialState: RolesState = {
  roles: null,
  loading: false,
  error: null,
};

const typeSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRolesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRolesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(getRolesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
      });
  },
});

export const { clearError } = typeSlice.actions;
export default typeSlice.reducer;
