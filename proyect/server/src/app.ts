import "dotenv/config";
import createEstadosRoute from "@/src/states/routesStates";
import createTiposRoute from "@/src/types/controller/routesTipos";
import createRolesRoute from "@/src/roles/routesRoles";
import express, { json } from "express";
import dotenv from "dotenv";
import { corsMiddleware, errorHandler } from "@/config/middleware";
import IRolesDAO from "@/src/roles/dao/IRolesDAO";
import IEstadosDAO from "@/src/states/dao/IStatesDAO";
import ITiposDAO from "@/src/types/model/dao/ITiposDAO";
import createUsuariosRoute from "@/src/users/controller/routesUsers";
import IUsersDAO from "@/src/users/model/dao/IUsersDAO";
import createAuthRoute from "./auth/routesAuth";
import cookieParser from "cookie-parser";

dotenv.config();

const createApp = (
  estadosDAO: IEstadosDAO,
  // usuariosDAO: IUsuariosDAO,
  tiposDAO: ITiposDAO,
  rolesDAO: IRolesDAO,
  usuariosDAO: IUsersDAO
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
  app.use("/estados", createEstadosRoute(estadosDAO));
  app.use("/tipos", createTiposRoute(tiposDAO));
  app.use("/roles", createRolesRoute(rolesDAO));
  app.use("/users", createUsuariosRoute(usuariosDAO));
  app.use("/auth", createAuthRoute(usuariosDAO));

  // Usar el middleware de manejo de errores al final de todas las rutas
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });

  return app; // Asegúrate de devolver la app para que pueda ser utilizada
};

export default createApp;
