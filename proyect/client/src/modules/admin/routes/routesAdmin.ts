import { AppRoutes } from "../../../core/interfaces/interfaceRoutes";
import DiaryAdminPage from "../page/DiaryAdminPage";
import TaskAdminPage from "../page/TaskAdminPage";
import UserAdminPage from "../page/UserAdminPage";

const routeAdmin: AppRoutes[] = [
  {
    path: "tasks",
    name: "Tareas",
    Component: TaskAdminPage,
  },
  {
    path: "diaries",
    name: "Diarios",
    Component: DiaryAdminPage,
  },
  {
    path: "users",
    name: "Usuarios",
    Component: UserAdminPage,
  },
];

export default routeAdmin;
