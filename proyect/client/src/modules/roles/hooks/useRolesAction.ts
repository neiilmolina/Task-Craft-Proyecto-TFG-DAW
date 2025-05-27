import { useCallback } from "react";
import { useAppDispatch } from "../../../store/hooks/store";
import { getRolesThunk } from "../store/redux/rolesThunks";

const useRolesActions = () => {
  const dispatch = useAppDispatch();

  const getRoles = useCallback(async () => {
    return await dispatch(getRolesThunk()).unwrap();
  }, [dispatch]);

  return {
    getRoles,
  };
};

export default useRolesActions;
