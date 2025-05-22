import { Navigate, Route, Routes } from "react-router-dom";
import Menu from "../components/Menu";
import routes from "./routes";
import NotFound from "../pages/NotFound";

export default function DashboardRoutes() {
  return (
    <div
      className="
        flex flex-row
        min-h-screen
        w-screen
        bg-grey
        position: relative
      "
    >
      <div
        className="
          w-1/8
        "
      >
        <Menu />
      </div>

      <div
        className="
          py-4
          pl-10
          pr-4
          flex-1
          position: relative
        "
      >
        <Routes>
          <Route path="" element={<Navigate to="tasks" replace />} />
          <Route index element={<Navigate to="tasks" replace />} />
          {routes.map((route) => (
            <Route
              key={route.name}
              path={route.path}
              element={<route.Component />}
            />
          ))}
          <Route path="" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
