import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import useTasksActions from "../hooks/useTasksActions";
import { useEffect, useState } from "react";
import Button from "../../../core/components/Button";
import TaskSections from "../components/TaskSection";
import { TaskDTO } from "task-craft-models";
import { useNavigate } from "react-router-dom";
import DashboardPageLayout from "../../../core/layout/DashboardPageLayout";

// Export this later from my package
type TypeTask = {
  idType: number;
  type: string;
  color: string;
};

export default function TasksPage() {
  const navigate = useNavigate();
  const { getTasks } = useTasksActions();
  const user = useSelector((state: RootState) => state.auth.user);
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [types, setTypes] = useState<TypeTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getTasks({ idUser: user.idUser }).finally(() => setLoading(false));
    }
  }, [user, getTasks]);

  useEffect(() => {
    if (tasks) {
      setTypes(
        Array.from(
          new Map(tasks.map((task) => [task.type.idType, task.type])).values()
        )
      );
    }
  }, [tasks]);

  if (!user) return <div>Necesitas iniciar sesión</div>;

  const onclick = () => navigate("/tasks/addTask");

  return (
    <DashboardPageLayout title="Tareas" loading={loading}>
      <Button onClick={onclick} color="primary">
        Añadir tarea
      </Button>
      {!tasks || tasks.length === 0 ? (
        <div>No hay tareas</div>
      ) : (
        types.map((type) => {
          const tasksOfThisType: TaskDTO[] = tasks.filter(
            (task) => task.type.idType === type.idType
          );
          return (
            <TaskSections
              key={`section-task-${type.type}`}
              tasks={tasksOfThisType}
              type={type}
            />
          );
        })
      )}
    </DashboardPageLayout>
  );
}
