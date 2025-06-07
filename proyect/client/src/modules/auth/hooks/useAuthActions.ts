import { useAppDispatch } from "../../../store/hooks/store";
import {
  loginThunk,
  registerThunk,
  logoutThunk,
  getAuthenticatedUserThunk,
  protectedThunk,
  changePasswordThunk,
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

  const logout = async () => {
    await dispatch(logoutThunk()).unwrap();
  };

  const getAuthenticatedUser = async () =>
    await dispatch(getAuthenticatedUserThunk());

  const protectedAuth = async () => await dispatch(protectedThunk()).unwrap();

  const changePassword = async (newPassword: string) => {
    await dispatch(changePasswordThunk(newPassword)).unwrap();
  };

  return {
    login,
    register,
    logout,
    getAuthenticatedUser,
    protectedAuth,
    changePassword,
  };
};

export default useAuthActions;
