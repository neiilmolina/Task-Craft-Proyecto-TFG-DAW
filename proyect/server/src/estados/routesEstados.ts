import { Router } from "express";
import EstadosController  from "@/src/estados/EstadosController";

export const createEstadosRoute = (estadosModel: any) => {
  const router = Router();
  const estadosController = new EstadosController(estadosModel);
  router.get('/estados', estadosController.getEstados);
  router.get('/estados/:id', estadosController.getEstadoById);
  router.post('/estados', estadosController.createEstado);
  router.put('/estados/:id', estadosController.updateEstado);
  router.delete('/estados/:id', estadosController.deleteEstado);

  return router;
};

export default createEstadosRoute;