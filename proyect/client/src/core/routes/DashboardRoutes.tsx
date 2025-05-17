import { Navigate, Route, Routes } from "react-router-dom";
import Menu from "../components/Menu";
import routes from "./routes";
import NotFound from "../pages/NotFound";

export default function DashboardRoutes() {
  return (
    <div
      className="
        flex flex-row
        h-screen w-screen
        bg-grey
        position: relative
      "
    >
      <div
        className="
          w-1/7
        "
      >
        <Menu />
      </div>

      <div
        className="
          p-4
        "
      >
        <Routes>
          <Route path="" element={<Navigate to="tasks" replace />} />
          <Route index element={<Navigate to="tasks" replace />} />
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.Component />}
            />
          ))}

          <Route path="*" element={<NotFound />} />
          
        </Routes>
      </div>
    </div>
  );
}
