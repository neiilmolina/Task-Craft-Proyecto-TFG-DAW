import React, { useState, useEffect } from "react";
import useOpenElement from "../../../core/hooks/useOpenElement";
import Button from "../../../core/components/Button";
import { User } from "task-craft-models";
import useUsersActions from "../hooks/useUsersActions";
import Icon from "../../../core/components/Icon";
import Input from "../../../core/components/Input";
import Container from "../../../core/components/Container";

export default function SearchableSelectUser({
  classNameButton,
  user,
  setUser,
}: {
  classNameButton?: string;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}) {
  const { getUsers, getUserById } = useUsersActions();
  const { isOpen, handleOpen, handleClose } = useOpenElement();

  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getUsers({ stringSearch: searchTerm }).then((data) => {
        setUsers(data || []);
      });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, getUsers]);

  const handleSelectUser = async (idUser: string) => {
    const foundUser = await getUserById(idUser);
    if (foundUser) {
      setUser(foundUser);
      handleClose();
    }
  };

  const handleCancel = () => {
    handleClose();
  };

  return (
    <>
      <button
        onClick={handleOpen}
        type="button"
        className={`
          px-4 py-2
          bg-gray-300
          rounded hover:bg-gray-400 ${classNameButton}
        `}
      >
        {user ? user.email : "Seleccionar usuario"}
      </button>

      {isOpen && (
        <dialog
          open
          className="
            flex flex-col
            gap-4
            z-50
            w-[800px] max-md:w-60
            m-0
            bg-grey
            rounded-2xl
            shadow-2xl
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          "
        >
          <header
            className="
              flex flex-row
              bg-primary
              justify-between items-start
              m-0
              h-14
              rounded-t-2xl
              p-4
            "
          >
            <h2 className="mb-4">Buscar Usuario</h2>
            <button onClick={handleCancel} type="button" color="error">
              <Icon name="close" style={{ fontSize: "1.5rem" }} />
            </button>
          </header>

          <main className="flex flex-col gap-8 p-4">
            <label
              className="
                w-full
                flex flex-row
                items-start
                gap-2
              "
            >
              <Input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                className="w-full h-11"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Icon name="search" style={{ fontSize: "2rem" }} />
            </label>

            <ul className="overflow-auto max-h-40 mb-4 rounded flex flex-col gap-2">
              {users.map((u) => (
                <li key={u.idUser}>
                  <Container className="flex justify-between items-center max-md:flex-col max-md:gap-2 max-md:items-start">
                    {u.email}
                    <Button type="button" onClick={() => handleSelectUser(u.idUser)}>
                      Escoger
                    </Button>
                  </Container>
                </li>
              ))}
              {users.length === 0 && (
                <li className="px-4 py-2 text-gray-400">
                  No se encontraron usuarios
                </li>
              )}
            </ul>
          </main>
        </dialog>
      )}
    </>
  );
}
