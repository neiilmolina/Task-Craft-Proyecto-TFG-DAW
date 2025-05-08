import { BrowserRouter } from "react-router-dom";
import AuthRoutes from "./modules/auth/components/AuthRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthRoutes />
    </BrowserRouter>
  );
}

export default App;
