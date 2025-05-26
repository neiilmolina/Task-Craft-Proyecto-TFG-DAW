import { Navigate, useLocation } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import Spinner from "../components/Spinner";
import useAuthActions from "../../modules/auth/hooks/useAuthActions";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { protectedAuth } = useAuthActions();
  const dispatch = useDispatch<AppDispatch>();

  const isProtected = useSelector((state: RootState) => state.auth.isProtected);
  const loading = useSelector((state: RootState) => state.auth.loading);

  useEffect(() => {
    console.log("Llamando protectedThunk");
    protectedAuth();
  }, [dispatch]);

  console.log("Redux: isProtected =", isProtected, "| loading =", loading);

  if (loading || isProtected === null) {
    return <Spinner />;
  }

  if (!isProtected) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
}
