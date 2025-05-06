import { Link } from "react-router-dom";
import routes from "../routes";

function Menu() {
  return (
    <nav className="h-full">
      <ul className="space-y-2 pt-40 flex flex-col bg-primary p-2.5 h-full justify-top">
        {routes.map((route) => (
          <li key={route.path}>
            <Link
              to={route.path}
              className="text-black p-2 font-bold bg-secondary bg-opacity-0 hover:bg-opacity-15 hover:w-[179px] hover:rounded"
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
