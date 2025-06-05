import { useState, useEffect } from "react";

export default function useOpenElement(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  // Función para abrir
  const handleOpen = () => setIsOpen(true);

  // Función para cerrar
  const handleClose = () => setIsOpen(false);

  // Función para alternar
  const handleToggle = () => setIsOpen(!isOpen);

  // Efecto que se ejecuta cuando `isOpen` cambia
  useEffect(() => {
    // Ejemplo: Cerrar al presionar ESC
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    if (isOpen) {
      // Añadir event listener cuando está abierto
      window.addEventListener("keydown", handleKeyDown);
    }

    // Limpieza: Remover event listener cuando el componente se desmonte o cambie isOpen
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]); // Dependencia: el efecto se re-ejecuta cuando isOpen cambia

  return {
    isOpen,
    handleOpen,
    handleClose,
    handleToggle,
  };
}
