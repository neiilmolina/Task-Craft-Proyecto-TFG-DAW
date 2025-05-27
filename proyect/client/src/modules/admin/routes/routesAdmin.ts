import { AppRoutes } from "../../../core/interfaces/interfaceRoutes";
import DiaryAdminPage from "../page/DiaryAdminPage";
import TaskAdminPage from "../page/TaskAdminPage";
import UserAdminPage from "../page/UserAdminPage";

const routeAdmin: AppRoutes[] = [
  {
    path: "tasks",
    name: "Task",
    Component: TaskAdminPage,
  },
  {
    path: "diaries",
    name: "Diary",
    Component: DiaryAdminPage,
  },
  {
    path: "users",
    name: "User",
    Component: UserAdminPage,
  },
];

export default routeAdmin;
