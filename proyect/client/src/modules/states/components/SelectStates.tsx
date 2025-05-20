import { useEffect, useState } from "react";
import SelectDialog from "../../../core/components/SelectDialog";
import useStateActions from "../hooks/useStateActions";
import { State } from "task-craft-models";

export default function SelectTypes({
  classNameButton,
  state,
  setState,
}: {
  classNameButton?: string;
  state: State | null;
  setState: React.Dispatch<React.SetStateAction<State | null>>;
}) {
  const { getStates } = useStateActions();
  const [states, setStates] = useState<State[]>([]);

  useEffect(() => {
    getStates().then((data) => {
      setStates(data);
      return;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = (selectedId: string) => {
    const id = parseInt(selectedId, 10);
    const foundState = states.find((t) => t.idState === id);
    if (foundState) {
      setState(foundState);
    }
  };

  const initialValue = "Selecciona un estado";
  return (
    <>
      {states.length > 0 && (
        <SelectDialog
          classNameButton={`${classNameButton}`}
          selectionMessage={initialValue}
          displayMap={Object.fromEntries(
            states.map((s) => [s.idState.toString(), s.state])
          )}
          onClose={handleClose}
          initialValue={state?.state}
        >
          <option value="">{initialValue}</option>
          {states.map((s) => (
            <option key={s.idState} value={s.idState}>
              {s.state}
            </option>
          ))}
        </SelectDialog>
      )}
    </>
  );
}
