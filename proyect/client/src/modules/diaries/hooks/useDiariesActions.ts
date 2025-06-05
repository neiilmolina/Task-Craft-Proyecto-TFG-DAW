import { useCallback } from "react";
import { useAppDispatch } from "../../../store/hooks/store";
import {
  getDiariesThunk,
  getDiaryByIdThunk,
  createDiaryThunk,
  updateDiaryThunk,
  deleteDiaryThunk,
} from "../store/redux/diariesThunks";
import { DiaryCreate, DiaryFilters, DiaryUpdate } from "task-craft-models";

const useDiariesActions = () => {
  const dispatch = useAppDispatch();

  const getDiaries = useCallback(
    async (diariesFilters: DiaryFilters) => {
      return await dispatch(getDiariesThunk(diariesFilters)).unwrap();
    },
    [dispatch]
  );

  const getDiaryById = async (id: string) => {
    return await dispatch(getDiaryByIdThunk(id)).unwrap();
  };

  const createDiary = async (diaryCreate: DiaryCreate) => {
    await dispatch(createDiaryThunk(diaryCreate)).unwrap();
  };

  const updateDiary = async (id: string, diaryUpdate: DiaryUpdate) => {
    await dispatch(updateDiaryThunk({ id, diaryUpdate })).unwrap();
  };

  const deleteDiary = async (id: string) => {
    await dispatch(deleteDiaryThunk(id)).unwrap();
  };

  return {
    getDiaries,
    getDiaryById,
    createDiary,
    updateDiary,
    deleteDiary,
  };
};

export default useDiariesActions;
