import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthRoutes from "./modules/auth/routes/AuthRoutes";
// import Dashboard from "./core/pages/Dahsboard";

function App() {
  return (
    <BrowserRouter>
      <AuthRoutes />;
    </BrowserRouter>
  );
}

export default App;
