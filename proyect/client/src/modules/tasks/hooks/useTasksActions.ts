import { useCallback } from "react";
import { useAppDispatch } from "../../../store/hooks/store";
import { getTasksThunk, getTaskByIdThunk } from "../store/redux/tasksThunks";
import { TaskFilters } from "task-craft-models";

const useAuthActions = () => {
  const dispatch = useAppDispatch();

  const getTasks = useCallback(
    async (tasksFilters: TaskFilters) => {
      return await dispatch(getTasksThunk(tasksFilters)).unwrap();
    },
    [dispatch]
  );

  const getTaskById = async (id: string) => {
    return await dispatch(getTaskByIdThunk(id)).unwrap();
  };

  return {
    getTasks,
    getTaskById,
  };
};

export default useAuthActions;
