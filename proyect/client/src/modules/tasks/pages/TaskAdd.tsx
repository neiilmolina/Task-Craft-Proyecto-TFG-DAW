import { TaskCreate, TaskUpdate } from "task-craft-models";
import TaskFormLayout from "../layouts/TaskFormLayout";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import Button from "../../../core/components/Button";

export default function TaskAdd() {
  const user = useSelector((state: RootState) => state.auth.user);

  const [formData, setFormData] = useState<TaskCreate | TaskUpdate>({
    activityDate: "",
    description: "",
    idState: 0,
    idType: 0,
    title: "",
    idUser: user?.idUser ?? "",
  });

  const onSubmit = async () => {
    console.log("Tarea creada:", formData);
  };

  return (
    <TaskFormLayout
      action="create"
      formData={formData}
      setFormData={setFormData}
      onSubmit={onSubmit}
      key={"Add"}
    >
      <Button>Añadir</Button>
    </TaskFormLayout>
  );
}
