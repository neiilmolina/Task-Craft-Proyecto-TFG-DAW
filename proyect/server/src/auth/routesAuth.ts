import IUsuariosDAO from "@/src/usuarios/dao/IUsuariosDAO";
import AuthController from "@/src/auth/AuthController";
import { Router } from "express";

const createAuthRoute = (usuariosDAO: IUsuariosDAO) => {
  const router = Router();
  const authController = new AuthController(usuariosDAO);

  router.get("/",  (req, res) => {
    res.send("Prueba");
  });
  router.post("/login", authController.login);
  //   router.post("/register", authController.createUsuario);
  //   router.put(
  //     "/updatePassword/:idUsuario",
  //     authController.updateUsuarioPassword
  //   );

  return router;
};

export default createAuthRoute;
