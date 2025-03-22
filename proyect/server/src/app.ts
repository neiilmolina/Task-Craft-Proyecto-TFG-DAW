import "dotenv/config";
import createEstadosRoute from "@/src/estados/routesEstados";
import createTiposRoute from "@/src/tipos/routesTipos";
import createUsuariosRoute from "@/src/usuarios/routesUsuarios";
import express, { json } from "express";
import dotenv from "dotenv";
import { corsMiddleware, errorHandler } from "@/config/middleware";

dotenv.config();

const createApp = (estadosModel: any, usuariosModel: any, tiposModel: any) => {
  const app = express();
  const port = process.env.PORT || 3000;
  app.use(json());
  app.disable("x-powered-by");

  // Usar el middleware de CORS
  app.use(corsMiddleware);

  // Ruta raíz
  app.get("/", (req, res) => {
    res.send("Servidor funcionando");
  });

  // Rutas de la API
  app.use("/estados", createEstadosRoute(estadosModel));
  app.use("/usuarios", createUsuariosRoute(usuariosModel));
  app.use("/tipos", createTiposRoute(tiposModel));

  // Usar el middleware de manejo de errores al final de todas las rutas
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });

  return app; // Asegúrate de devolver la app para que pueda ser utilizada
};

export default createApp;
