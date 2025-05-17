import { createAsyncThunk } from "@reduxjs/toolkit";
import TypesRepository from "../TypesRepository";
import { handleThunkError } from "../../../../core/hooks/captureErrors";

const typesRepository = new TypesRepository();

export const getTypesThunk = createAsyncThunk(
  "/types/",
  async (_, { rejectWithValue }) => {
    try {
      await typesRepository.getTypes();
    } catch (error) {
      return handleThunkError(
        error,
        rejectWithValue,
        "Error al obtener los categorias de la base de datos."
      );
    }
  }
);
