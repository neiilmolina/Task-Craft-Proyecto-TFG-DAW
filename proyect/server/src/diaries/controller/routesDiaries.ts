import DiariesController from "@/src/diaries/controller/DiariesController";
import IDiariesDAO from "@/src/diaries/model/dao/IDiariesDAO";
import { Router } from "express";

const createDiariesRoute = (DiariesDAO: IDiariesDAO) => {
  const router = Router();

  const diariesController = new DiariesController(DiariesDAO);

  router.get("/", diariesController.getDiaries);
  router.get("/:idDiary", diariesController.getDiaryById);
  router.post("/", diariesController.createDiary);
  router.put("/:idDiary", diariesController.updateDiary);
  router.delete("/:idDiary", diariesController.deleteDiary);

  return router;
};

export default createDiariesRoute;
