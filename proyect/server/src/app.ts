import "dotenv/config";
import createStatesRoute from "@/src/states/controller/routesStates";
import createTiposRoute from "@/src/types/controller/routesTypes";
import createRolesRoute from "@/src/roles/routesRoles";
import express, { json } from "express";
import dotenv from "dotenv";
import { corsMiddleware, errorHandler } from "@/config/middleware";
import IRolesDAO from "@/src/roles/dao/IRolesDAO";
import IStatesDAO from "@/src/states/model/dao/IStatesDAO";
import ITiposDAO from "@/src/types/model/dao/ITypesDAO";
import createUsuariosRoute from "@/src/users/controller/routesUsers";
import IUsersDAO from "@/src/users/model/dao/IUsersDAO";
import createAuthRoute from "./auth/routesAuth";
import cookieParser from "cookie-parser";

dotenv.config();

const createApp = (
  statesDAO: IStatesDAO,
  tiposDAO: ITiposDAO,
  rolesDAO: IRolesDAO,
  usersDAO: IUsersDAO
) => {
  const app = express();
  const port = process.env.PORT || 3000;
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
  app.use("/tipos", createTiposRoute(tiposDAO));
  app.use("/roles", createRolesRoute(rolesDAO));
  app.use("/users", createUsuariosRoute(usersDAO));
  app.use("/auth", createAuthRoute(usersDAO));

  // Usar el middleware de manejo de errores al final de todas las rutas
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });

  return app; // Asegúrate de devolver la app para que pueda ser utilizada
};

export default createApp;
