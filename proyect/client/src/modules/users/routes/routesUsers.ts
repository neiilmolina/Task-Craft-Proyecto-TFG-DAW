import { AppRoutes } from "../../../core/interfaces/interfaceRoutes";
import UserAdd from "../pages/UserAdd";
import UserDetails from "../pages/UserDetails";

const routesUsers: AppRoutes[] = [
  {
    path: "addUser",
    name: "Añadir usuario",
    Component: UserAdd,
  },
  {
    path: "detailsUser/:id",
    name: "Detalles usuario",
    Component: UserDetails,
  },
];

export default routesUsers;
