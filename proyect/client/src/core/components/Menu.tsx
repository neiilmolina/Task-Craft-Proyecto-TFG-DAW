import { Link } from "react-router-dom";
import routes from "../routes";

function Menu() {
  return (
    <nav className="h-full">
      <ul className="space-y-2 flex-col bg-primary p-2.5 h-full items-center">
        {routes.map((route) => (
          <li key={route.path}>
            <Link
              to={route.path}
              className="text-black p-2 font-bold hover:bg-secondary hover:opacity-15 hover:rounded "
            >
              {route.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Menu;
