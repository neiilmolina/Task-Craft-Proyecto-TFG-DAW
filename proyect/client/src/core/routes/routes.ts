// routes.ts
import TasksPage from "../../modules/tasks/pages/TasksPage";
import DiariesPage from "../../modules/diaries/pages/DiariesPage";

const routes: {
  path: string;
  Component: React.ComponentType;
  name: string;
}[] = [
  { path: "tasks", Component: TasksPage, name: "Tareas" },
  { path: "diaries", Component: DiariesPage, name: "Diarios" },
  // Agregar más rutas según sea necesario
];

export default routes;
