import "dotenv/config";
import createEstadosRoute from "@/src/estados/routesEstados";
import createTiposRoute from "@/src/tipos/routesTipos";
import createUsuariosRoute from "@/src/usuarios/routesUsuarios";
import express, { json, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

const createApp = (estadosModel: any, usuariosModel: any, tiposModel: any) => {
  const app = express();
  const port = process.env.PORT || 3000;
  app.use(json());
  app.disable("x-powered-by");

  // Ruta raíz
  app.get("/", (req, res) => {
    res.send("Servidor funcionando"); // Se envía la respuesta al cliente
  });

  // Rutas de la API
  app.use("/estados", createEstadosRoute(estadosModel));
  app.use("/usuarios", createUsuariosRoute(usuariosModel));
  app.use("/tipos", createTiposRoute(tiposModel));

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });

  // In your app.ts
  app.use((err, res) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  });

  return app; // Asegúrate de devolver la app para que pueda ser utilizada
};

export default createApp;
