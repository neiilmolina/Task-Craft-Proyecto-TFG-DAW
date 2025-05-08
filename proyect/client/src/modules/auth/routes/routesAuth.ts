import Login from "../pages/Login";
import Register from "../pages/Register";

const routesAuth = [
  {
    path: "/login",
    Component: Login,
    name: "Login",
  },
  {
    path: "/register",
    Component: Register,
    name: "Register",
  },
] as const;

export default routesAuth;
