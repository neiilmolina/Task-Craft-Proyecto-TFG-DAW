import { useAppDispatch } from "../../../store/hooks/store";
import {
  loginThunk,
  registerThunk,
  logoutThunk,
  getAuthenticatedUserThunk,
} from "../store/redux/authThunks";
import { UserCreate, UserLogin } from "task-craft-models";

const useAuthActions = () => {
  const dispatch = useAppDispatch();

  const login = async (creedentials: UserLogin) => {
    await dispatch(loginThunk(creedentials)).unwrap();
  };

  const register = async (user: UserCreate) => {
    await dispatch(registerThunk(user)).unwrap();
  };

  const logout = () => dispatch(logoutThunk());

  const getAuthenticatedUser = () => dispatch(getAuthenticatedUserThunk());

  return {
    login,
    register,
    logout,
    getAuthenticatedUser,
  };
};

export default useAuthActions;
