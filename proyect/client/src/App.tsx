import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardRoute from "./core/routes/DashboardRoutes";
import PrivateRoute from "./core/routes/PrivateRoute";
import Login from "./modules/auth/pages/Login";
import Register from "./modules/auth/pages/Register";
import { useEffect, useState } from "react";
import useAuthActions from "./modules/auth/hooks/useAuthActions";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import NotFound from "./core/pages/NotFound";
import TasksRoutes from "./modules/tasks/routes/TasksRoutes";
import Spinner from "./core/components/Spinner";
import DiariesRoutes from "./modules/diaries/routes/DiariesRoutes";
import Unauthorized from "./core/pages/Unauthorized";
import UsersRoutes from "./modules/users/routes/UsersRoutes";
import AuthRoutes from "./modules/auth/routes/AuthRoutes";

function App() {
  const [loading, setLoading] = useState(true);
  const { getAuthenticatedUser } = useAuthActions();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    getAuthenticatedUser().finally(() => {
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Spinner />;

  return (
    <BrowserRouter>
      <Routes>
        {/* <AuthRoutes /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute user={user}>
              <DashboardRoute />
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks/*"
          element={
            <PrivateRoute user={user}>
              <TasksRoutes />
            </PrivateRoute>
          }
        />

        <Route
          path="/diaries/*"
          element={
            <PrivateRoute user={user}>
              <DiariesRoutes />
            </PrivateRoute>
          }
        />

        <Route
          path="/users/*"
          element={
            <PrivateRoute user={user}>
              <UsersRoutes />
            </PrivateRoute>
          }
        />
 
        <Route
          path="/auth/*"
          element={
            <PrivateRoute user={user}>
              <AuthRoutes />
            </PrivateRoute>
          }
        />

        <Route
          path="/"
          element={
            <Navigate to={user ? "/dashboard/tasks" : "/login"} replace />
          }
        />

        <Route path="*" element={<NotFound />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
