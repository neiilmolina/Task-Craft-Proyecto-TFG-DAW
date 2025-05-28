import { TaskCreate, TaskUpdate } from "task-craft-models";
import TaskFormLayout from "../layouts/TaskFormLayout";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import Button from "../../../core/components/Button";
import useTasksActions from "../hooks/useTasksActions";
import { useNavigate } from "react-router-dom";

export default function TaskAdd() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { createTask } = useTasksActions();
  const navigator = useNavigate();

  const [formData, setFormData] = useState<TaskCreate | TaskUpdate>({
    activityDate: "",
    description: "",
    idState: 0,
    idType: 0,
    title: "",
    idUser: user?.idUser ?? "",
  });

  const onSubmit = async (data: TaskCreate | TaskUpdate) => {
    console.log("Submitting task data:", data);
    const parseData = data as TaskCreate;
    await createTask(parseData);
    navigator(-1);
  };

  return (
    <TaskFormLayout
      action="create"
      formData={formData}
      setFormData={setFormData}
      onSubmit={onSubmit}
      key={"Add"}
    >
      <Button type="submit">Añadir</Button>
    </TaskFormLayout>
  );
}
