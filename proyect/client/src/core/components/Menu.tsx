import { Link } from "react-router-dom";
import routes from "../routes/routes";

function Menu() {
  return (
    <nav
      className="
        h-full
      "
    >
      <ul
        className="
          flex flex-col
          h-full
          space-y-2 pt-40 p-2.5
          bg-primary
          justify-top
          gap-3.5
        "
      >
        {routes.map((route) => (
          <li key={route.path}>
            <Link
              to={`/dashboard/${route.path}`}
              className="
                max-w-64
                py-2 px-3
                text-black font-bold
                transition-all
                backdrop-opacity-10 duration-200 hover:bg-secondary/15 hover:rounded-lg hover:pr-20
              "
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
