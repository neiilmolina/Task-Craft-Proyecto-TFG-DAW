import { Link } from "react-router-dom";
import routes from "../routes";

function Menu() {
  return (
    <nav>
      <ul className="space-y-4">
        {routes.map((route) => (
          <li key={route.path}>
            <Link to={route.path} className="text-blue-500 hover:text-blue-700">
              {route.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Menu;
