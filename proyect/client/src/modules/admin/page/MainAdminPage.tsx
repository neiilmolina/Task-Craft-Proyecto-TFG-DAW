import { Route, Routes } from "react-router-dom";
import Submenu from "../../../core/components/Submenu";
import DashboardPageLayout from "../../../core/layout/DashboardPageLayout";
import routesAdmin from "../routes/routesAdmin";

export default function MainAdminPage() {
  return (
    <DashboardPageLayout className="w-full" title="Administración">
      <Submenu mainRoute="/dashboard/admin/" routes={routesAdmin} />

      <div className="flex flex-col gap-6 mt-5">
        <Routes>
          {routesAdmin.map((route) =>
            route.path === "tasks" ? (
              <>
                <Route
                  key={`${route.path}-index`}
                  index
                  element={<route.Component />}
                />
                <Route
                  key={route.path}
                  path={route.path}
                  element={<route.Component />}
                />
              </>
            ) : (
              <Route
                key={route.path}
                path={route.path}
                element={<route.Component />}
              />
            )
          )}
        </Routes>
      </div>
    </DashboardPageLayout>
  );
}
