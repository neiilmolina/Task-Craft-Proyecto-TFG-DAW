import { useEffect, useState } from "react";
import { User, UserCreate, UserUpdate } from "task-craft-models";
import useUsersActions from "../hooks/useUsersActions";
import { useNavigate, useParams } from "react-router-dom";
import UserFormLayout from "../layouts/UserFormLayout";
import Button from "../../../core/components/Button";
import Spinner from "../../../core/components/Spinner";

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const { getUserById, updateUser, deleteUser } = useUsersActions();
  const navigator = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<UserCreate | UserUpdate>({
    password: "",
    userName: "",
    idRole: 1,
    email: "",
  });

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (id) {
      getUserById(id).then((taskDTO) => {
        setUser(taskDTO);
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (data: UserCreate | UserUpdate) => {
    const parseData = data as UserUpdate;
    if (!id) return;
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas actualizar los campos de este usuario?"
    );
    if (!confirmed) return;
    await updateUser(id, parseData);
    navigator(-1);
  };

  const onClickDelete = async () => {
    if (!id) return;
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este usuario?"
    );
    if (!confirmed) return;
    await deleteUser(id);
    navigator(-1);
  };

  if (loading) return <Spinner />;
  if (!user) return <div>No se encontró el usuario.</div>;
  return (
    <UserFormLayout
      action="update"
      formData={formData}
      initialData={user}
      setFormData={setFormData}
      onSubmit={onSubmit}
    >
      <Button type="button" onClick={onClickDelete} color="error">
        Eliminar
      </Button>
      <Button color="primary">Editar</Button>
    </UserFormLayout>
  );
}
