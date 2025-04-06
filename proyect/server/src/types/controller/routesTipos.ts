import TiposController from "@/src/types/controller/TiposController";
import { Router } from "express";
import ITiposDAO from "../model/dao/ITiposDAO";

export const createTiposRoute = (tiposModel: ITiposDAO) => {
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
