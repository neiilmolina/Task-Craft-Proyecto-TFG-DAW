import { useLocation } from "react-router-dom";

const useQueryParams = () => {
  const useBooleanQueryParam = (paramName: string) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const value = queryParams.get(paramName);

    return value !== null && value.toLowerCase() === "true";
  };

  return {
    useBooleanQueryParam,
  };
};

export default useQueryParams;
