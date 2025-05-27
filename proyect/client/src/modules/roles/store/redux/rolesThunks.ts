import { createAsyncThunk } from "@reduxjs/toolkit";
import RolesRepository from "../RolesRepository";
import { handleThunkError } from "../../../../core/hooks/captureErrors";

const rolesRepository = new RolesRepository();

export const getRolesThunk = createAsyncThunk(
  "/roles/",
  async (_, { rejectWithValue }) => {
    try {
      return await rolesRepository.getRoles();
    } catch (error) {
      return handleThunkError(
        error,
        rejectWithValue,
        "Error al obtener los roles de la base de datos."
      );
    }
  }
);
