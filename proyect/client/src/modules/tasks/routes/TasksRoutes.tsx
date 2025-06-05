import { Route, Routes } from "react-router-dom";
import routesTasks from "./routesTasks";

export default function TasksRoutes() {
  return (
    <Routes>
      {routesTasks.map((route) => (
        <Route
          key={route.name}
          path={route.path}
          element={<route.Component />}
        />
      ))}
    </Routes>
  );
}
