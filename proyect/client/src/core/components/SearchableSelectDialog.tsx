import React, { useState, ReactNode } from "react";
import Button from "./Button";
import useOpenElement from "../hooks/useOpenElement";

export default function SearchableSelectDialog({
  classNameButton,
  selectionMessage,
  displayMap,
  children,
  onClose,
  initialValue,
}: {
  classNameButton: string;
  selectionMessage: string;
  displayMap: Record<string, string>;
  children: ReactNode;
  onClose: (selected: string) => void;
  initialValue?: string;
}) {
  const [selectedOption, setSelectedOption] = useState(initialValue ?? "");
  const [showValue, setShowValue] = useState(
    initialValue ? displayMap[initialValue] : selectionMessage
  );
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, handleOpen, handleClose } = useOpenElement();

  const handleAccept = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (selectedOption === "") {
      window.alert("Opción no válida");
      return;
    }
    handleClose();
    setShowValue(displayMap[selectedOption]);
    onClose(selectedOption);
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleClose();
  };

  const handleOpenDialog = () => {
    handleOpen();
    setSelectedOption(initialValue ?? "");
    setSearchTerm("");
  };

  const filteredChildren = React.Children.toArray(children).filter((child) => {
    if (React.isValidElement(child)) {
      const text = String(child.props.children).toLowerCase();
      return text.includes(searchTerm.toLowerCase());
    }
    return false;
  });

  return (
    <>
      <button
        onClick={handleOpenDialog}
        className={`px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 ${classNameButton}`}
        type="button"
      >
        {showValue}
      </button>

      {isOpen && (
        <dialog
          open
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-96 p-6 bg-white rounded-lg shadow-lg max-md:w-60">
            <h2 className="mb-4 text-xl font-semibold">
              Seleccione una opción
            </h2>

            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-3 px-3 py-2 border border-gray-300 rounded"
            />

            <ul className="max-h-40 overflow-auto border rounded divide-y divide-gray-200 mb-4">
              {filteredChildren.map((child) => {
                if (!React.isValidElement(child)) return null;
                const value = child.props.value;
                const isSelected = value === selectedOption;
                return (
                  <li
                    key={value}
                    className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                      isSelected ? "bg-blue-100 font-semibold" : ""
                    }`}
                    onClick={() => setSelectedOption(value)}
                  >
                    {child.props.children}
                  </li>
                );
              })}
            </ul>

            <div className="flex space-x-4 justify-end">
              <Button onClick={handleCancel} type="button" color="error">
                Cancelar
              </Button>
              <Button onClick={handleAccept} type="button">
                Aceptar
              </Button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
