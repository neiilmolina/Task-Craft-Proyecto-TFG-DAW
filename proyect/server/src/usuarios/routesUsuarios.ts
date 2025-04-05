import IUsuariosDAO from "@/src/usuarios/dao/IUsuariosDAO";
import UsuariosController from "@/src/usuarios/UsuariosController";
import { Router } from "express";

const createUsuariosRoute = (usuariosDAO: IUsuariosDAO) => {
  const router = Router();
  const usuariosController = new UsuariosController(usuariosDAO);

  router.get("/", usuariosController.getUsuarios);
  router.get("/:idUsuario", usuariosController.getUsuarioById);
  router.post("/validateUser", usuariosController.getUsuarioByCredentials);
  router.post("/create", usuariosController.createUsuario);
  router.put("/update/:idUsuario", usuariosController.updateUsuario);
  router.put("/updatePassword/:idUsuario", usuariosController.updateUsuarioPassword);
  router.delete("/:idUsuario", usuariosController.deleteUsuario);

  return router;
};

export default createUsuariosRoute;
