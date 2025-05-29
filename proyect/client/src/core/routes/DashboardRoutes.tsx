import { Navigate, Route, Routes } from "react-router-dom";
import Menu from "../components/Menu";
import routes from "./routesDashboards";
import NotFound from "../pages/NotFound";
import UserSettingsPage from "../../modules/auth/pages/UserSettingsPage";

import MainAdminPage from "../../modules/admin/page/MainAdminPage";
import ProtectedRoute from "./ProtectedRoute";

export default function DashboardRoutes() {
  return (
    <div
      className="
        flex flex-row
        bg-grey
        min-h-screen w-full relative
      "
    >
      <div
        className="
        w-1/6
        position: sticky
        "
      >
        <Menu />
      </div>

      <div
        className="
          py-4
          px-10
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
          <Route path="userSettings" element={<UserSettingsPage />} />
          <Route
            path="admin/*"
            element={
              <ProtectedRoute>
                <MainAdminPage />
              </ProtectedRoute>
            }
          />

          <Route path="" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
