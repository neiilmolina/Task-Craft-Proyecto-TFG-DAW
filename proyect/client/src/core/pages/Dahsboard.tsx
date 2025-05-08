import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Cambiar Switch por Routes
import Menu from "../components/Menu";
import routes from "../routes";

export default function Dashboard() {
  return (
    <Router>
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
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.Component />}
              />
            ))}
          </Routes>
        </div>
      </div>
    </Router>
  );
}
