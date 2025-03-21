import TiposController from "@/src/tipos/TiposController";
import TiposModel from "@/src/tipos/TiposModel";
import { Router } from "express";

export const createTiposRoute = (tiposModel: TiposModel) => {
  const router = Router();
  const tiposController = new TiposController(tiposModel);

  router.get("/", tiposController.getTipos);
  router.get("/:idTipo", tiposController.getTipoById);
  router.post("/", tiposController.createTipo);
  router.put("/:idTipo", tiposController.updateTipo);
  router.delete("/:idTipo", tiposController.deleteTipo);

  return router;
};

export default createTiposRoute;
