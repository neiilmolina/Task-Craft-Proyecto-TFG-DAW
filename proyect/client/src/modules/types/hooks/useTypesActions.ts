import { useCallback } from "react";
import { useAppDispatch } from "../../../store/hooks/store";
import { getTypesThunk } from "../store/redux/typesThunks";

const useTypesActions = () => {
  const dispatch = useAppDispatch();

  const getTypes = useCallback(async () => {
    return await dispatch(getTypesThunk()).unwrap();
  }, [dispatch]);

  return {
    getTypes,
  };
};

export default useTypesActions;
