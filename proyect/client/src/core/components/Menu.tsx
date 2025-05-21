import { Link } from "react-router-dom";
import routes from "../routes/routes";
import { useState, useEffect } from "react";

function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  return (
    <>
      {isMenuOpen && (
        <div
          onClick={toggleMenu}
          className="
            z-30
            bg-black/50
            transition-opacity opacity-0 animate-fade-in
            fixed inset-0 duration-300
            md:hidden
          "
        />
      )}

      <nav
        className="
          h-full
        "
      >
        <button
          onClick={toggleMenu}
          aria-label="Toggle menu"
          className={`
            z-50
            p-2.5
            text-sm font-bold
            bg-primary
            rounded-[100px]
            transition-transform
            fixed top-4 left-4 hover:scale-110
            md:hidden
          `}
        >
          ☰
        </button>

        <div
          className={`
            flex flex-col
            h-full
            space-y-2 p-2.5 pt-20
            bg-primary
            transition-all
            duration-300 ease-in-out
            md:pt-10
            ${
              isMenuOpen
                ? "fixed inset-0 z-40 w-64 animate-slide-in-left"
                : "hidden md:block md:w-full"
            }
          `}
        >
          <ul
            className={`
              flex flex-col
              justify-center gap-4
            `}
          >
            {routes.map((route) => (
              <li key={route.path}>
                <Link
                  to={`/dashboard/${route.path}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="
                    w-64 max-xl:hover:pr-8
                    max-lg:hover:pr-4
                    py-2 px-3
                    text-[18px] text-black font-bold
                    transition-all
                    backdrop-opacity-10 duration-200 hover:bg-secondary/15 hover:rounded-lg hover:pr-20 hover:translate-x-2 hover:no-underline
                  "
                >
                  {route.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Menu;
