import { Route, Routes } from "react-router-dom";
import { AppRoutes } from "../../../core/interfaces/interfaceRoutes";
import AuthUpdatePassword from "../pages/AuthUpdatePassword";

const routesAuth: AppRoutes[] = [
  {
    path: "changePassword",
    name: "Cambiar contraseña",
    Component: AuthUpdatePassword,
  },
];

export default function AuthRoutes() {
  return (
    <Routes>
      {routesAuth.map((route) => (
        <Route
          key={route.name}
          path={route.path}
          element={<route.Component />}
        />
      ))}
    </Routes>
  );
}
