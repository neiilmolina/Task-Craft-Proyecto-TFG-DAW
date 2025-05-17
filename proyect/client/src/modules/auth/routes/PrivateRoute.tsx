import { Navigate, useLocation } from "react-router-dom";
import { UserToken } from "task-craft-models";

type PrivateRouteProps = {
  children: JSX.Element;
  user: UserToken | null;
};

export default function PrivateRoute({ children, user}: PrivateRouteProps ) {
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
