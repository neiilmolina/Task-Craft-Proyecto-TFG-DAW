import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardRoutes from "./core/routes/DashboardRoutes";
import PrivateRoute from "./modules/auth/routes/PrivateRoute";
import Login from "./modules/auth/pages/Login";
import Register from "./modules/auth/pages/Register";
// import Dashboard from "./core/pages/Dahsboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <AuthRoutes /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <DashboardRoutes />
            </PrivateRoute>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
