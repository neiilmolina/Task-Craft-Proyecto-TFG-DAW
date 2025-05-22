import { AppRoutes } from "../../../core/interfaces/interfaceRoutes";
import TaskAdd from "../pages/TaskAdd";
import TaskDetails from "../pages/TaskDetails";

const routesTasks: AppRoutes[] = [
  {
    path: "addTask",
    name: "Añadir Tarea",
    Component: TaskAdd,
  },
  {
    path: "detailsTask/:id",
    name: "Detalles tarea",
    Component: TaskDetails,
  },
];

export default routesTasks;
