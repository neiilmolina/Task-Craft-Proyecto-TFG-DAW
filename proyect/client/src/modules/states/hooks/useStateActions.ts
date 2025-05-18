import { useAppDispatch } from "../../../store/hooks/store";
import { getStatesThunk } from "../store/redux/statesThunks";

const useStateActions = () => {
  const dispatch = useAppDispatch();

  const getStates = async () => {
    return await dispatch(getStatesThunk()).unwrap();
  };

  return {
    getStates,
  };
};

export default useStateActions;
