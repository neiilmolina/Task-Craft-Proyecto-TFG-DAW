import IUsuariosDAO from "@/src/users/model/dao/IUsersDAO";
import UsuariosController from "@/src/users/controller/UsersController";
import { Router } from "express";

const createUsuariosRoute = (usuariosDAO: IUsuariosDAO) => {
  const router = Router();
  const usuariosController = new UsuariosController(usuariosDAO);

  router.get("/", usuariosController.getUsers);
  router.get("/:idUser", usuariosController.getUsuarioById);
  router.post("/validateUser", usuariosController.getUsuarioByCredentials);
  router.post("/create", usuariosController.createUsuario);
  router.put("/update/:idUser", usuariosController.updateUsuario);
  router.put("/updatePassword/:idUser", usuariosController.updateUsuarioPassword);
  router.delete("/:idUser", usuariosController.deleteUsuario);

  return router;
};

export default createUsuariosRoute;
