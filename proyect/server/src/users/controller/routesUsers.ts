import IUsersDAO from "@/src/users/model/dao/IUsersDAO";
import UsersController from "@/src/users/controller/UsersController";
import { Router } from "express";

const createUsersRoute = (usersDAO: IUsersDAO) => {
  const router = Router();
  const usersController = new UsersController(usersDAO);

  router.get("/", usersController.getUsers);
  router.get("/:idUser", usersController.getUserById);
  // router.post("/validateUser", usersController.getUserByCredentials);
  router.post("/create", usersController.createUser);
  router.put("/update/:idUser", usersController.updateUser);
  // router.put("/updatePassword/:idUser", usersController.updateUserPassword);
  router.delete("/:idUser", usersController.deleteUser);

  return router;
};

export default createUsersRoute;
