import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Cambiar Switch por Routes
import Menu from "./core/components/Menu";
import routes from "./core/routes";

function App() {
  return (
    <Router>
      <div className="bg-grey h-screen w-screen flex">
        {/* Menu */}
        <Menu />

        {/* Contenedor de contenido */}
        <div className="flex-[5] p-4">
          {" "}
          {/* flex-1 para ocupar el resto del espacio */}
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

export default App;
