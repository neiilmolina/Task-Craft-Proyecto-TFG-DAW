import { AppRoutes } from "../../../core/interfaces/interfaceRoutes";
import DiaryAdminPage from "../page/DiaryAdminPage";
import TaskAdminPage from "../page/TaskAdminPage";
import UserAdminPage from "../page/UserAdminPage";

const routeAdmin: AppRoutes[] = [
  {
    path: "tasks",
    name: "Task Admin",
    Component: TaskAdminPage,
  },
  {
    path: "diaries",
    name: "Diary Admin",
    Component: DiaryAdminPage,
  },
  {
    path: "users",
    name: "User Admin",
    Component: UserAdminPage,
  },
];

export default routeAdmin;
