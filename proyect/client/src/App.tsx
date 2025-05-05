import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Cambiar Switch por Routes
import Menu from "./core/components/Menu";
import routes from "./core/routes";

function App() {
  return (
    <Router>
      <div className="App">
        <Menu />

        <div className="content">
          {/* Usar Routes en lugar de Switch */}
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.Component />} // Usar 'element' en lugar de 'render'
              />
            ))}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
