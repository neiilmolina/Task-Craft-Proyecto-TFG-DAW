import { useEffect, useState } from "react";
import SelectDialog from "../../../core/components/SelectDialog";
import useRolesAction from "../hooks/useRolesAction";
import { Role } from "task-craft-models";

export default function SelectRoles({
  classNameButton,
  role,
  setRole,
}: {
  classNameButton?: string;
  role: Role | null;
  setRole: React.Dispatch<React.SetStateAction<Role | null>>;
}) {
  const { getRoles } = useRolesAction();
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    getRoles().then((data) => {
      setRoles(data);
      return;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = (selectedId: string) => {
    const id = parseInt(selectedId, 10);
    const foundRole = roles.find((t) => t.idRole === id);
    if (foundRole) {
      setRole(foundRole);
    }
  };

  const initialValue = "Selecciona un rol";
  return (
    <>
      {roles.length > 0 && (
        <SelectDialog
          classNameButton={`${classNameButton}`}
          selectionMessage={initialValue}
          displayMap={Object.fromEntries(
            roles.map((s) => [s.idRole.toString(), s.role])
          )}
          onClose={handleClose}
          initialValue={role?.role}
        >
          <option value="">{initialValue}</option>
          {roles.map((s) => (
            <option key={s.idRole} value={s.idRole}>
              {s.role}
            </option>
          ))}
        </SelectDialog>
      )}
    </>
  );
}
