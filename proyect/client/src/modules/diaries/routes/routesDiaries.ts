import { AppRoutes } from "../../../core/interfaces/interfaceRoutes";
import DiariesAdd from "../pages/DiariesAdd";
import DiariesDetails from "../pages/DiariesDetails";

const routesDiaries: AppRoutes[] = [
  {
    path: "addDiary",
    name: "Añadir Diario",
    Component: DiariesAdd,
  },
  {
    path: "detailsDiary/:id",
    name: "Detalles tarea",
    Component: DiariesDetails,
  },
];

export default routesDiaries;
