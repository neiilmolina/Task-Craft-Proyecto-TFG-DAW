import { useEffect, useState } from "react";
import SelectDialog from "../../../core/components/SelectDialog";
import useTypesActions from "../hooks/useTypesActions";
import { Type } from "task-craft-models";

export default function SelectTypes() {
  const { getTypes } = useTypesActions();
  const [types, setTypes] = useState<Type[]>([]);
  const [selectedType, setSelectedType] = useState<Type | null>(null);

  // Obtener los tipos al cargar
  useEffect(() => {
    getTypes().then((data) => {
      setTypes(data); // data debe ser Type[]
      console.log("Tipos:", data);
    });
  }, []);

  // Callback cuando se cierra el diálogo
  const handleClose = (selectedName: string) => {
    const foundType = types.find((t) => t.type === selectedName);
    if (foundType) {
      setSelectedType(foundType);
      console.log("Tipo seleccionado:", foundType);
    }
  };

  return (
    <>
      {types.length > 0 && (
        <SelectDialog
          values={types.map((t) => t.type)}
          onClose={(selected) => handleClose(selected)}
        />
      )}
    </>
  );
}
