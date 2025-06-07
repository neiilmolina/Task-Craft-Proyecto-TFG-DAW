import IUsersDAO from "@/src/users/model/dao/IUsersDAO";
import AuthController from "@/src/auth/AuthController";
import { Router } from "express";
import authMiddleware from "@/src/auth/authMiddleware";

const createAuthRoute = (usuariosDAO: IUsersDAO) => {
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
  router.post("/refresh", (req, res) => authController.refreshToken(req, res));
  router.patch("/changePassword", (req, res) =>
    authController.changePassword(req, res)
  );
  router.patch("/changeEmail", (req, res) =>
    authController.changeEmail(req, res)
  );
  router.patch("/changeUserName", (req, res) =>
    authController.changeUserName(req, res)
  );
  router.delete("/", authController.delete);

  return router;
};

export default createAuthRoute;
