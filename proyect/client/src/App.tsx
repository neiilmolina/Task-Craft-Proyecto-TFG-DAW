import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardRoutes from "./core/routes/DashboardRoutes";
import PrivateRoute from "./modules/auth/routes/PrivateRoute";
import Login from "./modules/auth/pages/Login";
import Register from "./modules/auth/pages/Register";
import { useEffect, useState } from "react";
import useAuthActions from "./modules/auth/hooks/useAuthActions";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import NotFound from "./core/pages/NotFound";

function App() {
  const [checking, setChecking] = useState(true);
  const { getAuthenticatedUser } = useAuthActions();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    getAuthenticatedUser().finally(() => {
      setChecking(false);
    });
  }, []);

  if (checking) return <div>Cargando sesión...</div>;

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
              <DashboardRoutes />
            </PrivateRoute>
          }
        />

        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard/*" : "/login"} replace />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
