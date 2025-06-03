import { Link } from "react-router-dom";
import routes from "../routes/routesDashboards";
import { useState, useEffect } from "react";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import Icon from "./Icon";
import Logo from "../../icons/Logo";

const APP_NAME = "TASK-CRAFT";

function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Botón de apertura */}
      {!isMenuOpen && (
        <button
          onClick={toggleMenu}
          aria-label="Toggle menu"
          className="
            z-50
            p-2.5
            text-sm font-bold
            bg-primary
            rounded-full
            transition-transform
            fixed top-4 left-4 hover:scale-110
            xl:hidden
          "
        >
          ☰
        </button>
      )}

      {isMenuOpen && (
        <div
          onClick={toggleMenu}
          className="
            z-30
            bg-black/50
            transition-opacity opacity-0 animate-fade-in
            fixed inset-0 duration-300
            xl:hidden
          "
        />
      )}

      <nav
        className={`
          flex flex-col
          h-full
          p-2.5
          bg-primary
          transition-all
          justify-between gap-11 duration-300 ease-in-out
          ${
            isMenuOpen
              ? "fixed inset-0 z-50 w-64 animate-slide-in-left xl:static xl:animate-none"
              : "hidden xl:fixed xl:inset-y-0 xl:left-0 xl:z-50 xl:w-64 xl:flex"
          }

        `}
      >
        {isMenuOpen && (
          <button
            onClick={toggleMenu}
            aria-label="Close menu"
            className="
              z-50
              p-2.5
              text-sm font-bold
              bg-primary
              rounded-full
              transition-transform
              absolute top-3 right-4 hover:scale-110
              xl:hidden
            "
          >
            ✕
          </button>
        )}

        <header
          className="
            w-full
            flex flex-row items-center gap-2
            py-2 px-3
            text-[20px] text-black font-bold
            cursor-pointer
          "
        >
          <Logo width={30} height={30} />
          {APP_NAME}
        </header>

        <ul
          className="
            flex flex-col flex-1
            w-full
            py-20
            xl:py-10
          "
        >
          {routes.map((route) => (
            <li key={route.path}>
              <Link
                to={`/dashboard/${route.path}`}
                onClick={() => setIsMenuOpen(false)}
                className="
                  flex flex-row
                  gap-2
                  w-32 max-xl:hover:pr-8
                  py-2 px-3
                  text-[18px] text-black font-bold
                  transition-all
                  items-center duration-200 hover:bg-secondary/15 hover:rounded-lg hover:pr-20 hover:translate-x-2 hover:no-underline
                "
              >
                {route.icon && <Icon name={route.icon} />}
                {route.name}
              </Link>
            </li>
          ))}
        </ul>

        <footer
          className="
            flex flex-col
            w-full
            border-t border-black/10
            gap-2.5
          "
        >
          <Link
            onClick={() => setIsMenuOpen(false)}
            to={"/dashboard/userSettings"}
            className="
            flex flex-row gap-2 items-end
              w-4/5 max-xl:hover:pr-8
              py-2 px-3
              text-[18px] text-black font-bold
              transition-all
              duration-200 hover:bg-secondary/15 hover:rounded-lg hover:pr-20 hover:no-underline
            "
          >
            <Icon name="account_circle"/>
            {user?.userName}
          </Link>
        </footer>
      </nav>
    </>
  );
}

export default Menu;
