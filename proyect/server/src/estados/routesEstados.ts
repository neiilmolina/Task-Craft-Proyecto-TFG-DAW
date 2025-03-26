// src/routes/createEstadosRoute.ts
import { Router } from "express";
import EstadosController from "@/src/estados/EstadosController";
import EstadosModel from "@/src/estados/EstadosModel";
import IEstadosDAO from "./dao/IEstadosDAO";

export const createEstadosRoute = (estadosDAO: IEstadosDAO) => {
  const router = Router();
  const estadosController = new EstadosController(estadosDAO);

  router.get("/", estadosController.getEstados);
  router.get("/:idEstado", estadosController.getEstadoById);
  router.post("/", estadosController.createEstado);
  router.put("/:idEstado", estadosController.updateEstado);
  router.delete("/:idEstado", estadosController.deleteEstado);

  return router;
};

export default createEstadosRoute;
