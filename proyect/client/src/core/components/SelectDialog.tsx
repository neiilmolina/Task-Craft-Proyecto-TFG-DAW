import React, { useState, ReactNode } from "react";
import Select from "./Select";
import Button from "./Button";
import useOpenElement from "../hooks/useOpenElement";
import Icon from "./Icon";

function SelectDialog({
  selectionMessage,
  displayMap,
  children,
  onClose,
  initialValue,
}: {
  classNameButton?: string;
  selectionMessage: string;
  displayMap: Record<string, string>;
  children: ReactNode;
  onClose: (selected: string) => void;
  initialValue?: string;
}) {
  const [selectedOption, setSelectedOption] = useState(initialValue ?? "");
  const [showValue, setShowValue] = useState(initialValue ?? selectionMessage);
  const { isOpen, handleOpen, handleClose } = useOpenElement();

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleAccept = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(selectedOption);
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
    setSelectedOption("");
  };

  return (
    <>
      <button
        onClick={handleOpenDialog}
        className={`flex flex-row gap-2 items-center justify-center`}
        type="button"
      >
        {showValue}
        <Icon name="arrow_drop_down"/>
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
            <div className="flex flex-col space-y-4">
              <Select value={selectedOption} onChange={handleSelectChange}>
                {children}
              </Select>

              <div className="flex space-x-4 justify-end">
                <Button onClick={handleCancel} type="button" color="error">
                  Cancelar
                </Button>
                <Button onClick={handleAccept} type="button">
                  Aceptar
                </Button>
              </div>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}

export default SelectDialog;
