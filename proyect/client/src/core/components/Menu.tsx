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
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300 opacity-0 animate-fade-in"
          onClick={toggleMenu}
        />
      )}

      <nav className="h-full">
        <button
          onClick={toggleMenu}
          className={`lg:hidden
             fixed top-4 left-4 z-50 p-2 text-2xl font-bold bg-primary rounded-xl transition-transform 
             hover:scale-110`}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <div
          className={`
            h-full 
            flex flex-col 
            bg-primary
            space-y-2 p-2.5
            pt-20 lg:pt-10
            transition-all duration-300 ease-in-out
            ${
              isMenuOpen
                ? "fixed inset-0 z-40 w-64 animate-slide-in-left"
                : "hidden lg:block lg:w-full"
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
                    py-2 px-3
                    text-black font-bold
                    transition-all
                    backdrop-opacity-10 duration-200 hover:bg-secondary/15 hover:rounded-lg hover:pr-20
                    hover:translate-x-2
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
