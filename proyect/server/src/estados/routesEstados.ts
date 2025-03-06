// src/routes/createEstadosRoute.ts
import { Router } from "express";
import EstadosController from "@/src/estados/EstadosController";
import EstadosModel from "@/src/estados/EstadosModel";

export const createEstadosRoute = (estadosModel: EstadosModel) => {
  const router = Router();
  const estadosController = new EstadosController(estadosModel);
  
  router.get('/estados', estadosController.getEstados);
  router.get('/estados/:idEstado', estadosController.getEstadoById);
  router.post('/estados', estadosController.createEstado);
  router.put('/estados/:idEstado', estadosController.updateEstado);
  router.delete('/estados/:idEstado', estadosController.deleteEstado);

  return router;
};

export default createEstadosRoute;
