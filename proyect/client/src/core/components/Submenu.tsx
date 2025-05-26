import { Link, useLocation } from "react-router-dom";
import { AppRoutes } from "../interfaces/interfaceRoutes";

type SubmenuProps = {
  routes: AppRoutes[];
  mainRoute: string;
};

export default function Submenu({ routes, mainRoute }: SubmenuProps) {
  const location = useLocation();

  return (
    <ul className="flex flex-row gap-3 w-full mt-2">
      {routes.map((route) => {
        const linkNavigation = `${mainRoute}${route.path}`;
        const isActive = location.pathname === linkNavigation;

        return (
          <li key={route.path}>
            <Link
              className={`hover:no-underline ${isActive ? "text-black" : ""}`}
              style={!isActive ? { color: "var(--color-greyDark)" } : {}}
              to={linkNavigation}
            >
              {route.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
