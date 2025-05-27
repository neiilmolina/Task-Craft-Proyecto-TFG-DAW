import { useEffect, useState } from "react";
import SelectDialog from "../../../core/components/SelectDialog";
import useUsersAction from "../hooks/useUserAction";
import { User } from "task-craft-models";

export default function SelectUsers({
  classNameButton,
  user,
  setUser,
}: {
  classNameButton?: string;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}) {
  const { getUsers } = useUsersAction();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers({}).then((data) => {
      setUsers(data);
      return;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = (selectedId: string) => {
    const foundUser = users.find((t) => t.idUser === selectedId);
    if (foundUser) {
      setUser(foundUser);
    }
  };

  const initialValue = "Selecciona un usuario";
  return (
    <>
      {users.length > 0 && (
        <SelectDialog
          classNameButton={`${classNameButton}`}
          selectionMessage={initialValue}
          displayMap={Object.fromEntries(
            users.map((s) => [s.idUser.toString(), s.email])
          )}
          onClose={handleClose}
          initialValue={user?.email}
        >
          <option value="">{initialValue}</option>
          {users.map((s) => (
            <option key={s.idUser} value={s.idUser}>
              {s.email}
            </option>
          ))}
        </SelectDialog>
      )}
    </>
  );
}
