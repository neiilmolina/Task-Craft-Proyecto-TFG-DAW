import { Routes, Route } from "react-router-dom";
import routesAuth from "../routesAuth";

// Tipos para las rutas
interface RouteChild {
  path: string;
  element: React.ReactNode;
  name?: string;
}

interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteChild[];
  name?: string;
}

// Componente AuthRoutes con TypeScript
export default function AuthRoutes(): JSX.Element {
  return (
    <Routes>
      {routesAuth.map((route: RouteConfig) => (
        <Route key={route.path} path={route.path} element={route.element}>
          {route.children?.map((child: RouteChild) => (
            <Route key={child.path} path={child.path} element={child.element} />
          ))}
        </Route>
      ))}
    </Routes>
  );
}
