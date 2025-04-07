import TypesController from "@/src/types/controller/TypesController";
import { Router } from "express";
import ITiposDAO from "../model/dao/ITypesDAO";

export const createTypesRoute = (typesModel: ITiposDAO) => {
  const router = Router();
  const typesController = new TypesController(typesModel);

  router.get("/", typesController.getTypes);
  router.get("/:idType", typesController.getTypeById);
  router.post("/", typesController.createType);
  router.put("/:idType", typesController.updateType);
  router.delete("/:idType", typesController.deleteType);

  return router;
};

export default createTypesRoute;
