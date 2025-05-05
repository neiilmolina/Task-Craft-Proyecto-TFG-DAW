import React, { useState } from "react";
import Select from "./Select"; // Asegúrate de que el componente Select esté correctamente importado
import Button from "./Button"; // Asegúrate de que Button esté correctamente importado

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

  // Estado para manejar si el diálogo está abierto o cerrado
  const [isOpen, setIsOpen] = useState(false);

  // Abrir el diálogo
  const handleOpen = () => {
    setIsOpen(true);
  };

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
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        {showValue}
      </button>

      {/* El diálogo solo se muestra si isOpen es verdadero */}
      {isOpen && (
        <dialog open>
          <div className="p-6 w-96 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Seleccione una opción
            </h2>
            <form method="dialog" className="flex flex-col space-y-4">
              <Select
                value={selectedOption}
                onChange={handleSelectChange}
                className="w-full"
              >
                {values.map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </Select>

              <div className="flex justify-end space-x-4">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    setShowValue(selectedOption);
                    onClose();
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
