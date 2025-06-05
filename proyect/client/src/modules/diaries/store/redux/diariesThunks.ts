import { createAsyncThunk } from "@reduxjs/toolkit";
import DiariesRepository from "../DiariesRepository";
import { handleThunkError } from "../../../../core/hooks/captureErrors";
import { DiaryCreate, DiaryFilters, DiaryUpdate } from "task-craft-models";

const diariesRepository = new DiariesRepository();

export const getDiariesThunk = createAsyncThunk(
  "/diaries/",
  async (diaryFilters: DiaryFilters, { rejectWithValue }) => {
    try {
      const response = await diariesRepository.getDiaries(diaryFilters);
      return response;
    } catch (error) {
      return handleThunkError(
        error,
        rejectWithValue,
        "Error al obtener los diarios de el base de datos."
      );
    }
  }
);

export const getDiaryByIdThunk = createAsyncThunk(
  "/diaries/getDiaryById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await diariesRepository.getDiaryById(id);
      return response;
    } catch (error) {
      return handleThunkError(
        error,
        rejectWithValue,
        "Error al obtener el diario"
      );
    }
  }
);

export const createDiaryThunk = createAsyncThunk(
  "diaries/create",
  async (diaryCreate: DiaryCreate, { rejectWithValue }) => {
    try {
      await diariesRepository.addDiary(diaryCreate);
    } catch (error) {
      return handleThunkError(
        error,
        rejectWithValue,
        "Error al crear el diario"
      );
    }
  }
);

export const updateDiaryThunk = createAsyncThunk(
  "diaries/update",
  async (
    { id, diaryUpdate }: { id: string; diaryUpdate: DiaryUpdate },
    { rejectWithValue }
  ) => {
    try {
      await diariesRepository.updateDiary(id, diaryUpdate);
    } catch (error) {
      return handleThunkError(
        error,
        rejectWithValue,
        "Error al actualizar el diario"
      );
    }
  }
);

export const deleteDiaryThunk = createAsyncThunk(
  "/diaries/deleteDiary",
  async (id: string, { rejectWithValue }) => {
    try {
      await diariesRepository.deleteDiary(id);
    } catch (error) {
      return handleThunkError(
        error,
        rejectWithValue,
        "Error al eliminar el diario"
      );
    }
  }
);
