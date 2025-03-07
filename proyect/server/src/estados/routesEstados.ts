// src/routes/createEstadosRoute.ts
import { Router } from "express";
import EstadosController from "@/src/estados/EstadosController";
import EstadosModel from "@/src/estados/EstadosModel";

export const createEstadosRoute = (estadosModel: EstadosModel) => {
  const router = Router();
  const estadosController = new EstadosController(estadosModel);
  
  router.get('/', estadosController.getEstados);
  router.get('/:idEstado', estadosController.getEstadoById);
  router.post('/', estadosController.createEstado);
  router.put('/:idEstado', estadosController.updateEstado);
  router.delete('/:idEstado', estadosController.deleteEstado);

  return router;
};

export default createEstadosRoute;
