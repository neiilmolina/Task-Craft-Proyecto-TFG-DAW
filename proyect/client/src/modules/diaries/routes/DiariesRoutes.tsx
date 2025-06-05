import { Route, Routes } from "react-router-dom";
import routesDiaries from "./routesDiaries";

export default function DiariesRoutes() {
  return (
    <Routes>
      {routesDiaries.map((route) => (
        <Route
          key={route.name}
          path={route.path}
          element={<route.Component />}
        />
      ))}
    </Routes>
  );
}
