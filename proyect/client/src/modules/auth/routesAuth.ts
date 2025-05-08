import { lazy } from "react";
import AuthLayout from "./layouts/AuthLayout"; // Asegúrate que la ruta es correcta

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

interface RouteChild {
  path: string;
  element: React.ReactNode;
  name?: string;
}

interface AuthRouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteChild[];
  name?: string;
}

const routesAuth: AuthRouteConfig[] = [
  {
    path: "/auth",
    element: <AuthLayout /> , // Debe ser un elemento JSX
    children: [
      {
        path: "login",
        element: <Login />, // Componente lazy debe ser renderizado como JSX
        name: "Login",
      },
      {
        path: "register",
        element: <Register />, // Componente lazy debe ser renderizado como JSX
        name: "Register",
      },
    ],
  },
];

export default routesAuth;
