import { useEffect, useState } from "react";
import SelectDialog from "../../../core/components/SelectDialog";
import useTypesActions from "../hooks/useTypesActions";
import { Type } from "task-craft-models";

export default function SelectTypes({
  classNameButton,
  type,
  setType,
}: {
  classNameButton?: string;
  type?: Type | null;
  setType: React.Dispatch<React.SetStateAction<Type | null>>;
}) {
  const { getTypes } = useTypesActions();
  const [types, setTypes] = useState<Type[]>([]);

  useEffect(() => {
    getTypes().then((data) => {
      setTypes(data);
      return;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = (selectedId: string) => {
    const id = parseInt(selectedId, 10);
    const foundType = types.find((t) => t.idType === id);
    if (foundType) {
      setType(foundType);
    }
  };

  return (
    <>
      {types.length > 0 && (
        <SelectDialog
          classNameButton={`${classNameButton}`}
          selectionMessage="Selecciona una categoria"
          displayMap={Object.fromEntries(
            types.map((t) => [t.idType.toString(), t.type])
          )}
          onClose={handleClose}
          initialValue={type?.type}
        >
          {types.map((t) => (
            <option key={t.idType} value={t.idType}>
              {t.type}
            </option>
          ))}
        </SelectDialog>
      )}
    </>
  );
}
