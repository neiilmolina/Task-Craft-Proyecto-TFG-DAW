import { useAppDispatch } from "../../../store/hooks/store";
import { getTypesThunk } from "../store/redux/typesThunks";

const useTypesActions = () => {
  const dispatch = useAppDispatch();

  const getTypes = async () => {
    return await dispatch(getTypesThunk()).unwrap();
  };

  return {
    getTypes,
  };
};

export default useTypesActions;
