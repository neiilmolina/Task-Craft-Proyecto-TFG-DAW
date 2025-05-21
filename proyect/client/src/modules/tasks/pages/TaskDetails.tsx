import { useParams } from "react-router-dom";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { TaskCreate, TaskDTO, TaskUpdate } from "task-craft-models";
import useTasksActions from "../hooks/useTasksActions";
import Spinner from "../../../core/components/Spinner";
import TaskFormLayout from "../layouts/TaskFormLayout";
import Button from "../../../core/components/Button";

export default function TaskDetails() {
  const { id } = useParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { getTaskById, updateTask } = useTasksActions();

  console.log(id);

  const [task, setTask] = useState<TaskDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<TaskCreate | TaskUpdate>({
    activityDate: "",
    description: "",
    idState: 0,
    idType: 0,
    title: "",
    idUser: user?.idUser ?? "",
  });

  useEffect(() => {
    if (user && id) {
      getTaskById(id).then((taskDTO) => {
        setTask(taskDTO);
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id]);

  const onSubmit = async (data: TaskCreate | TaskUpdate) => {
    const dataParse = data as TaskUpdate;
    if (id) {
      updateTask(id, dataParse);
    }
  };

  if (loading) return <Spinner />;
  if (!task) return <div>No se encontró la tarea.</div>;

  return (
    <TaskFormLayout
      action="update"
      formData={formData}
      setFormData={setFormData}
      initialData={task}
      onSubmit={onSubmit}
    >
      <div className="flex flex-row justify-between gap-10">
        <Button color="error">Eliminar</Button>
        <Button color="primary">Editar</Button>
      </div>
    </TaskFormLayout>

    // <div>Detalles de la tarea: {task.title}</div>
  );
}
