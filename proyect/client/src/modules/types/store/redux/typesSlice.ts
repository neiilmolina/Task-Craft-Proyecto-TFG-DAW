import { Type } from "task-craft-models";
import { ReduxError } from "../../../../core/interfaces/interfaceErrors";
import { createSlice } from "@reduxjs/toolkit";
import { getTypesThunk } from "./typesThunks";

interface TypesState {
  types: Type[] | null;
  loading: boolean;
  error: ReduxError;
}

const initialState: TypesState = {
  types: null,
  loading: false,
  error: null,
};

const typeSlice = createSlice({
  name: "types",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTypesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTypesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.types = action.payload;
      })
      .addCase(getTypesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ReduxError;
      });
  },
});

export const { clearError } = typeSlice.actions;
export default typeSlice.reducer;
