import { Route, Routes } from "react-router-dom";
import routesUsers from "./routesUsers";

export default function UsersRoutes() {
  return (
    <Routes>
      {routesUsers.map((route) => (
        <Route
          key={route.name}
          path={route.path}
          element={<route.Component />}
        />
      ))}
    </Routes>
  );
}
