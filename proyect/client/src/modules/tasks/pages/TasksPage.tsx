import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import useTasksActions from "../hooks/useTasksActions";
import { useEffect, useState } from "react";
import Button from "../../../core/components/Button";
import TaskCard from "../components/TaskCard";

export default function TasksPage() {
  const { getTasks } = useTasksActions();
  const user = useSelector((state: RootState) => state.auth.user);
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getTasks({ idUser: user.idUser }).finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) return <div>Necesitas iniciar sesión</div>;

  if (loading) return <div>Cargando tareas...</div>;

  if (!tasks || tasks.length === 0) return <div>No hay tareas</div>;

  return (
    <main>
      <h1>Tareas</h1>
      <Button color="primary">Añadir tarea</Button>
      {tasks.map((task) => (
        <TaskCard key={task.idTask} task={task}/>
      ))}
    </main>
  );
}
