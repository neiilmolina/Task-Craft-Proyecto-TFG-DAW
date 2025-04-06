// src/routes/createEstadosRoute.ts
import { Router } from "express";
import EstadosController from "@/src/states/StatesController";
import EstadosModel from "@/src/states/StatesRepository";
import IEstadosDAO from "./dao/IStatesDAO";

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
