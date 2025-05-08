// routes.ts
import TasksPages from "../modules/tasks/pages/TasksPages";
import DiariesPages from "../modules/diaries/pages/DiariesPages";

// Definimos las rutas y sus componentes
const routes: {
  path: string;
  Component: React.ComponentType;
  name: string;
}[] = [
  { path: "/tasks", Component: TasksPages, name: "Tareas" },
  { path: "/diaries", Component: DiariesPages, name: "Diarios" },
  // Agregar más rutas según sea necesario
];

export default routes;
