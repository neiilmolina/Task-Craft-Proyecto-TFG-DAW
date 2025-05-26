import { Navigate, useLocation } from "react-router-dom";
import { RouteManagementProps } from "../interfaces/AuthSettings";

export default function PrivateRoute({ children, user}: RouteManagementProps ) {
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
