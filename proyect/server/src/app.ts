import express, { json } from "express";
import { corsMiddleware, errorHandler } from "@/config/middleware";
import "dotenv/config";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import IStatesDAO from "@/src/states/model/dao/IStatesDAO";
import createStatesRoute from "@/src/states/controller/routesStates";
import ITiposDAO from "@/src/types/model/dao/ITypesDAO";
import createTiposRoute from "@/src/types/controller/routesTypes";
import IRolesDAO from "@/src/roles/model/dao/IRolesDAO";
import createRolesRoute from "@/src/roles/controller/routesRoles";
import IUsersDAO from "@/src/users/model/dao/IUsersDAO";
import createUsuariosRoute from "@/src/users/controller/routesUsers";
import createAuthRoute from "@/src/auth/routesAuth";
import ITaskDAO from "@/src/tasks/model/dao/ITasksDAO";
import createTasksRoute from "@/src/tasks/controller/routesTasks";
import IDiariesDAO from "@/src/diaries/model/dao/IDiariesDAO";
import createDiariesRoute from "@/src/diaries/controller/routesDiaries";
import IFriendsDAO from "@/src/friends/model/dao/IFriendsDAO";
import createFriendsRoute from "@/src/friends/controller/http/routesFriends";

dotenv.config();

const createApp = (
  statesDAO: IStatesDAO,
  tiposDAO: ITiposDAO,
  rolesDAO: IRolesDAO,
  usersDAO: IUsersDAO,
  tasksDAO: ITaskDAO,
  diariesDAO: IDiariesDAO,
  friendsDAO: IFriendsDAO
) => {
  const app = express();
  app.use(json());
  app.use(cookieParser());
  app.disable("x-powered-by");

  // Usar el middleware de CORS
  app.use(corsMiddleware);

  // Ruta raíz
  app.get("/", (req, res) => {
    res.send("Servidor funcionando");
  });

  // Rutas de la API
  app.use("/states", createStatesRoute(statesDAO));
  app.use("/types", createTiposRoute(tiposDAO));
  app.use("/roles", createRolesRoute(rolesDAO));
  app.use("/users", createUsuariosRoute(usersDAO));
  app.use("/auth", createAuthRoute(usersDAO));
  app.use("/tasks", createTasksRoute(tasksDAO));
  app.use("/diaries", createDiariesRoute(diariesDAO));
  app.use("/friends", createFriendsRoute(friendsDAO));

  // Usar el middleware de manejo de errores al final de todas las rutas
  app.use(errorHandler);

  return app; // Asegúrate de devolver la app para que pueda ser utilizada
};

export default createApp;
