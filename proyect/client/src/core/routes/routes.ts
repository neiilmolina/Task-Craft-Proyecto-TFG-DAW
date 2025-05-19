// routes.ts
import TasksPage from "../../modules/tasks/pages/TasksPage";
import DiariesPage from "../../modules/diaries/pages/DiariesPage";
import { AppRoutes } from "../interfaces/interfaceRoutes";

const routes: AppRoutes[] = [
  { path: "tasks", Component: TasksPage, name: "Tareas" },
  { path: "diaries", Component: DiariesPage, name: "Diarios" },
  // Agregar más rutas según sea necesario
];

export default routes;
