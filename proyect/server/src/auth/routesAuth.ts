import IUsuariosDAO from "@/src/usuarios/dao/IUsuariosDAO";
import AuthController from "@/src/auth/AuthController";
import { Router } from "express";
import authMiddleware from "@/src/auth/authMiddleware";

const createAuthRoute = (usuariosDAO: IUsuariosDAO) => {
  const router = Router();
  const authController = new AuthController(usuariosDAO);

  router.post("/register", (req, res, next) =>
    authController.register(req, res, next)
  );
  router.post("/login", (req, res) => authController.login(req, res));
  
  router.use(authMiddleware);
  router.get("/", (req, res) => {
    authController.getAuthenticatedUser(req, res);
  });

  router.post("/logout", (req, res) => authController.logout(req, res));

  router.get("/protected", (req, res) => authController.protected(req, res));
  //   router.put(
  //     "/updatePassword/:idUsuario",
  //     authController.updateUsuarioPassword
  //   );

  return router;
};

export default createAuthRoute;
