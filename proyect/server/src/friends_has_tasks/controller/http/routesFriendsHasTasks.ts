import FriendsHasTasksHTTPController from "@/src/friends_has_tasks/controller/http/FriendsHasTasksHTTPController";
import { Router } from "express";
import IFriendsHasTasksDAO from "@/src/friends_has_tasks/model/dao/IFriendsHasTasksDAO";

const createFriendsHasTasksRoutes = (friendsDAO: IFriendsHasTasksDAO) => {
  const router = Router();

  const friendsHasTasksHTTPController = new FriendsHasTasksHTTPController(
    friendsDAO
  );

  router.get("/", friendsHasTasksHTTPController.getFriendsHasTasks);
  router.get(
    "/:idFriendsHasTasks",
    friendsHasTasksHTTPController.getFriendsHasTasksById
  );
  router.post("/", friendsHasTasksHTTPController.createFriendsHasTasks);
  router.put(
    "/:idFriendsHasTasks",
    friendsHasTasksHTTPController.updateFriendsHasTasks
  );
  router.delete(
    "/:idFriendsHasTasks",
    friendsHasTasksHTTPController.deleteFriendsHasTasks
  );

  return router;
};

export default createFriendsHasTasksRoutes;
