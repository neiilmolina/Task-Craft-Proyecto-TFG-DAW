import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import useTasksActions from "../hooks/useTasksActions";
import { useEffect, useState } from "react";
import Button from "../../../core/components/Button";
import TaskSections from "../components/TaskSection";
import { TaskDTO } from "task-craft-models";

// Export this later from my package
type TypeTask = {
  idType: number;
  type: string;
  color: string;
};

export default function TasksPage() {
  const { getTasks } = useTasksActions();
  const user = useSelector((state: RootState) => state.auth.user);
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState<TypeTask[]>([]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getTasks({ idUser: user.idUser }).finally(() => setLoading(false));
      // DO THIS IN THE BACK END, NOT IN THE FRONT END
      // GET TYPES
      console.log(tasks)
      if (tasks) {
        setTypes(
          Array.from(
            new Map(tasks.map((task) => [task.type.idType, task.type])).values()
          )
        );
      }
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
      {types.map((type) => {
        const tasksOfThisType: TaskDTO[] = tasks.filter(
          (task) => task.type.idType === type.idType
        );
        return <TaskSections key={`section-task-${type.type}`} tasks={tasksOfThisType} type={type} />;
      })}
    </main>
  );
}
