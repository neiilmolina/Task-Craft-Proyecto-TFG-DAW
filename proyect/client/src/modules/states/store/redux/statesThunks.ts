import { createAsyncThunk } from "@reduxjs/toolkit";
import StatesRepository from "../StatesRepository";
import { handleThunkError } from "../../../../core/hooks/captureErrors";

const statesRepository = new StatesRepository();

export const getStatesThunk = createAsyncThunk(
  "/states/",
  async (_, { rejectWithValue }) => {
    try {
      return await statesRepository.getStates();
    } catch (error) {
      return handleThunkError(
        error,
        rejectWithValue,
        "Error al obtener los categorias de la base de datos."
      );
    }
  }
);
