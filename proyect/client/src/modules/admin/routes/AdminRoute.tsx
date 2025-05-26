import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../../../core/components/Spinner";
import useAuthActions from "../../auth/hooks/useAuthActions";

type AdminRouteProps = {
  children: JSX.Element;
};

export default function AdminRoute({ children }: AdminRouteProps) {
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const { protectedAuth } = useAuthActions();

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        await protectedAuth();
        setIsAuthorized(true);
      } catch {
        setIsAuthorized(false);
      }
    };
    verifyAccess();
  }, [protectedAuth]);

  if (isAuthorized === null) {
    return <Spinner />;
  }

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return { children };
}
