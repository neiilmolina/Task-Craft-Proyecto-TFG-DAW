import { useCallback } from "react";
import { useAppDispatch } from "../../../store/hooks/store";
import {
  getUsersThunk,
  getUserByIdThunk,
  createUserThunk,
  updateUserThunk,
  deleteUserThunk,
} from "../store/redux/usersThunks";
import { UserCreate, UserFilter, UserUpdate } from "task-craft-models";

const useUsersActions = () => {
  const dispatch = useAppDispatch();

  const getUsers = useCallback(
    async (usersFilters: UserFilter) => {
      return await dispatch(getUsersThunk(usersFilters)).unwrap();
    },
    [dispatch]
  );

  const getUserById = async (id: string) => {
    return await dispatch(getUserByIdThunk(id)).unwrap();
  };

  const createUser = async (userCreate: UserCreate) => {
    await dispatch(createUserThunk(userCreate)).unwrap();
  };

  const updateUser = async (id: string, userUpdate: UserUpdate) => {
    await dispatch(updateUserThunk({ id, userUpdate })).unwrap();
  };

  const deleteUser = async (id: string) => {
    await dispatch(deleteUserThunk(id)).unwrap();
  };

  return {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  };
};

export default useUsersActions;
