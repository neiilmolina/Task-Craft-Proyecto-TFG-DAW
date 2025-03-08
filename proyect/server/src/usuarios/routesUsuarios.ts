import { Router } from "express";
import UsuariosController from "@/src/usuarios/UsuariosController";
import UsuariosModel from "@/src/usuarios/UsuariosModel";

export const createUsuariosRoute = (usuariosModel: UsuariosModel) => {
  const router = Router();
  const usuariosController = new UsuariosController(usuariosModel);

  // Rutas para usuarios
  router.get("/", usuariosController.getUsuarios);
  router.get("/:id", usuariosController.getUsuarioById);
  router.post("/", usuariosController.createUsuario);
  router.put("/:id", usuariosController.updateUsuario);
  router.delete("/:id", usuariosController.deleteUsuario);
  router.put("/:id/password", usuariosController.changePassword);
  router.post("/reset-email", usuariosController.resetEmail);

  // Rutas para autenticación
  router.post("/sign-in", usuariosController.signIn);
  router.post("/sign-up", usuariosController.signUp);
  router.post("/sign-out", usuariosController.signOut);
  router.post("/reset-password", usuariosController.resetPassword);

  return router;
};

export default createUsuariosRoute;
