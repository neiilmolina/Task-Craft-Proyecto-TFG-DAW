import { Route, Routes } from "react-router-dom";
import { AppRoutes } from "../../../core/interfaces/interfaceRoutes";
import AuthUpdatePassword from "../pages/AuthUpdatePassword";
import AuthUpdateEmail from "../pages/AuthUpdateEmail";
import AuthUpdateUserName from "../pages/AuthUpdateUserName";
import AuthDeleteUser from "../pages/AuthDeleteUser";

const routesAuth: AppRoutes[] = [
  {
    path: "changePassword",
    name: "Cambiar contraseña",
    Component: AuthUpdatePassword,
  },
  {
    path: "changeEmail",
    name: "Cambiar email",
    Component: AuthUpdateEmail,
  },
  {
    path: "changeUserName",
    name: "Cambiar username",
    Component: AuthUpdateUserName,
  },
  {
    path: "delete",
    name: "Eliminar cuenta",
    Component: AuthDeleteUser,
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
