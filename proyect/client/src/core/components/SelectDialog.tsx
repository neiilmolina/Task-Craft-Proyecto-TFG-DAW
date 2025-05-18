import React, { useState, ReactNode } from "react";
import Select from "./Select";
import Button from "./Button";
import useOpenElement from "../hooks/useOpenElement";

function SelectDialog({
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
  const [selectedOption, setSelectedOption] = useState("");
  const [showValue, setShowValue] = useState(initialValue ?? selectionMessage);
  const { isOpen, handleOpen, handleClose } = useOpenElement();

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleAccept = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleClose();
    setShowValue(displayMap[selectedOption] || selectionMessage);
    onClose(selectedOption);
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleClose();
  };

  const handleOpenDialog = () => {
    handleOpen();
    setSelectedOption("");
  };

  return (
    <>
      <button
        onClick={handleOpenDialog}
        className={`px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 ${classNameButton}`}
      >
        {showValue}
      </button>

      {isOpen && (
        <dialog
          open
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-96 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">
              Seleccione una opción
            </h2>
            <form method="dialog" className="flex flex-col space-y-4">
              <Select value={selectedOption} onChange={handleSelectChange}>
                {children}
              </Select>

              <div className="flex space-x-4 justify-end">
                <Button onClick={handleCancel} color="error">
                  Cancelar
                </Button>
                <Button onClick={handleAccept}>Aceptar</Button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </>
  );
}

export default SelectDialog;
