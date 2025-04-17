import IFriendsDAO from "@/src/friends/model/dao/IFriendsDAO";
import { Router } from "express";
import FriendsHTTPController from "@/src/friends/controller/http/FriendsHTTPController";

const createFriendsRoute = (friendsDAO: IFriendsDAO) => {
  const router = Router();

  const friendsHTTPController = new FriendsHTTPController(friendsDAO);

  router.get("/", friendsHTTPController.getFriends);
  router.get("/:idFriend", friendsHTTPController.getFriendById);
  router.post("/", friendsHTTPController.createFriend);
  router.put("/:idFriend", friendsHTTPController.updateFriend);
  router.delete("/:idFriend", friendsHTTPController.deleteFriend);

  return router;
};

export default createFriendsRoute;
