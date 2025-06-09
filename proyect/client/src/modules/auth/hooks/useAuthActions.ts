import { useAppDispatch } from "../../../store/hooks/store";
import {
  loginThunk,
  registerThunk,
  logoutThunk,
  getAuthenticatedUserThunk,
  protectedThunk,
  changePasswordThunk,
  changeEmailThunk,
  changeUserNameThunk,
  deleteThunk,
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

  const changePassword = async ({
    newPassword,
    actualPassword,
  }: {
    newPassword: string;
    actualPassword: string;
  }) => {
    await dispatch(
      changePasswordThunk({
        newPassword,
        actualPassword,
      })
    ).unwrap();
  };

  const changeEmail = async ({
    newEmail,
    actualEmail,
  }: {
    newEmail: string;
    actualEmail: string;
  }) => {
    await dispatch(changeEmailThunk({ newEmail, actualEmail })).unwrap();
  };

  const changeUserName = async ({
    newUserName,
    actualUserName,
  }: {
    newUserName: string;
    actualUserName: string;
  }) => {
    await dispatch(
      changeUserNameThunk({ newUserName, actualUserName })
    ).unwrap();
  };

  const deleteAccount = async (creedentials: UserLogin) => {
    await dispatch(deleteThunk(creedentials)).unwrap();
  };

  return {
    login,
    register,
    logout,
    getAuthenticatedUser,
    protectedAuth,
    changePassword,
    changeEmail,
    changeUserName,
    deleteAccount,
  };
};

export default useAuthActions;
