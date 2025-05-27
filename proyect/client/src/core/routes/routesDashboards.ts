// routes.ts
import TasksPage from "../../modules/tasks/pages/TasksPage";
import DiariesPage from "../../modules/diaries/pages/DiariesPage";
import { AppRoutes } from "../interfaces/interfaceRoutes";

const routes: AppRoutes[] = [
  { path: "tasks", Component: TasksPage, name: "Tareas", icon:"business_center"},
  { path: "diaries", Component: DiariesPage, name: "Diarios", icon:"book" },
  // Agregar más rutas según sea necesario
];

export default routes;
