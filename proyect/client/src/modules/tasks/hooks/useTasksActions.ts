import { useCallback } from "react";
import { useAppDispatch } from "../../../store/hooks/store";
import {
  getTasksThunk,
  getTaskByIdThunk,
  createTaskThunk,
  updateTaskThunk,
  deleteTaskThunk,
} from "../store/redux/tasksThunks";
import { TaskCreate, TaskFilters, TaskUpdate } from "task-craft-models";

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

  const createTask = async (taskCreate: TaskCreate) => {
    await dispatch(createTaskThunk(taskCreate)).unwrap();
  };

  const updateTask = async (id: string, taskUpdate: TaskUpdate) => {
    await dispatch(updateTaskThunk({ id, taskUpdate })).unwrap();
  };

  const deleteTask = async (id: string) => {
    await dispatch(deleteTaskThunk(id)).unwrap();
  };

  return {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
  };
};

export default useAuthActions;
