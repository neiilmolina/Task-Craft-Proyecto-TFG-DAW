import { useNavigate } from "react-router-dom";
import { UserCreate, UserUpdate } from "task-craft-models";
import useUsersActions from "../hooks/useUsersActions";
import UserFormLayout from "../layouts/UserFormLayout";
import { useState } from "react";
import Button from "../../../core/components/Button";

export default function UserAdd() {
  const { createUser } = useUsersActions();
  const navigator = useNavigate();

  const [formData, setFormData] = useState<UserCreate | UserUpdate>({
    password: "",
    userName: "",
    idRole: 1,
    email: "",
  });

  const onSubmit = async (data: UserCreate | UserUpdate) => {
    try {
        console.log("Submitting user data:");
      const parseData = data as UserCreate;
      await createUser(parseData);
      navigator(-1);
    } catch (error) {
        console.error("Error creating user:", error);
    }
  };
  return (
    <UserFormLayout
      action="create"
      formData={formData}
      setFormData={setFormData}
      onSubmit={onSubmit}
    >
      <Button>Añadir</Button>
    </UserFormLayout>
  );
}
