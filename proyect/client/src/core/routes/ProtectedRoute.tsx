import { Navigate, useLocation } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import useAuthActions from "../../modules/auth/hooks/useAuthActions";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const { protectedAuth } = useAuthActions();

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        await protectedAuth(); // ← Aquí validas rol, permisos, etc.
        setIsAuthorized(true);
      } catch {
        setIsAuthorized(false);
      }
    };

    verifyAccess();
  }, [protectedAuth]);

  console.log("isAuthorized", isAuthorized);
  
  if (isAuthorized === null) return <Spinner />;

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
}
