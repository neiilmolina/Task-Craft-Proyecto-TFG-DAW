import React, { useState } from "react";
import Select from "./Select"; // Asegúrate de que el componente Select esté correctamente importado
import Button from "./Button"; // Asegúrate de que Button esté correctamente importado
import useOpenElement from "../hooks/useOpenElement";

function Dialog({
  values,
  onClose,
}: {
  values: string[]; // Especificar que `values` es un array de strings
  onClose: () => void;
}) {
  // Valor por defecto
  const defaultValue = values[0] || ""; // Asegúrate de tener un valor por defecto si `values` está vacío

  // Estado para el valor seleccionado
  const [showValue, setShowValue] = useState(defaultValue);
  const [selectedOption, setSelectedOption] = useState(defaultValue);
  const { isOpen, handleOpen, handleClose } = useOpenElement();

  // Manejar cambio del select
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value as string;
    setSelectedOption(newValue);
  };

  return (
    <>
      {/* Botón que abre el diálogo */}
      <button
        onClick={handleOpen}
        className="
          px-4 py-2
          bg-gray-300
          rounded hover:bg-gray-400
        "
      >
        {showValue}
      </button>

      {/* El diálogo solo se muestra si isOpen es verdadero */}
      {isOpen && (
        <dialog
          open
          className="
            position:absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          "
        >
          <div
            className="
              w-96
              p-6
              bg-white
              rounded-lg
              shadow-lg
            "
          >
            <h2
              className="
                mb-4
                text-xl font-semibold
              "
            >
              Seleccione una opción
            </h2>
            <form
              method="dialog"
              className="
                flex flex-col
                space-y-4
              "
            >
              <Select
                value={selectedOption}
                onChange={handleSelectChange}
                className="
                  w-full
                "
              >
                {values.map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </Select>

              <div
                className="
                  flex
                  space-x-4
                  justify-end
                "
              >
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleClose();
                  }}
                  color="error"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleClose();
                    setShowValue(selectedOption);
                    onClose();
                  }}
                >
                  Aceptar
                </Button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </>
  );
}

export default Dialog;
