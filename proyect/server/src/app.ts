import "dotenv/config";
import createEstadosRoute from "@/src/estados/routesEstados";
import express, { json } from "express";
import dotenv from "dotenv";

dotenv.config();

const createApp = (estadosModel: any) => {
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

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
  
  return app; // Asegúrate de devolver la app para que pueda ser utilizada
};

export default createApp;
