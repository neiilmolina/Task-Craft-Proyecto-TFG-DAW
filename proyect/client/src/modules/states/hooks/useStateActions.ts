import { useCallback } from "react";
import { useAppDispatch } from "../../../store/hooks/store";
import { getStatesThunk } from "../store/redux/statesThunks";

const useStateActions = () => {
  const dispatch = useAppDispatch();

  const getStates = useCallback(async () => {
    return await dispatch(getStatesThunk()).unwrap();
  }, [dispatch]);

  return {
    getStates,
  };
};

export default useStateActions;
