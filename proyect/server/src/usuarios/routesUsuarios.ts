import { Router } from "express";
import UsuariosController from "@/src/usuarios/UsuariosController";
import IUsuariosDAO from "@/src/usuarios/dao/IUsuariosDAO";

export const createUsuariosRoute = (usuariosModel: IUsuariosDAO) => {
  const router = Router();
  const usuariosController = new UsuariosController(usuariosModel);

  // Rutas para usuarios
  router.get("/", usuariosController.getUsuarios);
  router.get("/:id", usuariosController.getUsuarioById);
  router.post("/", usuariosController.createUsuario);
  router.put("/:id", usuariosController.updateUsuario);
  router.delete("/:id", usuariosController.deleteUsuario);
  router.put("/:id/password", usuariosController.changePassword);
  // Rutas para autenticación
  router.post("/reset-email", usuariosController.resetEmail);
  router.post("/sign-in", usuariosController.signIn);
  router.post("/sign-up", usuariosController.signUp);
  router.post("/sign-out", usuariosController.signOut);
  router.post("/reset-password", usuariosController.resetPassword);

  return router;
};

export default createUsuariosRoute;
