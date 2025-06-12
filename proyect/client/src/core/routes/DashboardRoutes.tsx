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
        justify-start
      "
    >
      <div
        className="
        w-1/5
        max-xl:w-[10%]
        max-md:w-1/5
        "
      >
        <Menu />
      </div>
      <div
        className="
          py-4
          px-8
          flex-1
          max-xl:pl-0
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

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
