import { useCallback } from "react";
import { useAppDispatch } from "../../../store/hooks/store";
import { getTasksThunk } from "../store/redux/tasksThunks";
import { TaskFilters } from "task-craft-models";

const useAuthActions = () => {
  const dispatch = useAppDispatch();

  const getTasks = useCallback(
    async (tasksFilters: TaskFilters) => {
      await dispatch(getTasksThunk(tasksFilters)).unwrap();
    },
    [dispatch]
  );

  return {
    getTasks,
  };
};

export default useAuthActions;
