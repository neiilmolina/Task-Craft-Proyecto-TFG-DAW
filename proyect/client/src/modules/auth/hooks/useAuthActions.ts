import { useAppDispatch } from "../../../store/hooks/store";
import {
  loginThunk,
  registerThunk,
  logoutThunk,
  getAuthenticatedUserThunk,
} from "../store/redux/authThunks";
import { UserCreate } from "task-craft-models";

const useAuthActions = () => {
  const dispatch = useAppDispatch();

  const login = ({ email, password }: { email: string; password: string }) =>
    dispatch(loginThunk({ email, password }));

  const register = (user: UserCreate) => dispatch(registerThunk(user));

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
