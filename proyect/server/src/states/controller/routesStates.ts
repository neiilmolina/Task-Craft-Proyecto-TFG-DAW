import { Router } from "express";
import StatesController from "@/src/states/controller/StatesController";
import IStatesDAO from "../model/dao/IStatesDAO";

export const createStatesRoute = (statesDAO: IStatesDAO) => {
  const router = Router();
  const statesController = new StatesController(statesDAO);

  router.get("/", statesController.getStates);
  router.get("/:idState", statesController.getStateById);
  router.post("/", statesController.createState);
  router.put("/:idState", statesController.updateState);
  router.delete("/:idState", statesController.deleteState);

  return router;
};

export default createStatesRoute;
