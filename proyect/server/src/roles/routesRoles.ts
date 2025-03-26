import { Router } from "express";
import RolesController from "@/src/roles/RolesController";
import IRolesDAO from "@/src/roles/dao/IRolesDAO";

const createRolesRoute = (rolesDAO: IRolesDAO) => {
  const router = Router();
  const rolesController = new RolesController(rolesDAO);

  router.get("/", rolesController.getRoles);
  router.get("/:idRol", rolesController.getRolById);
  router.post("/", rolesController.createRol);
  router.put("/:idRol", rolesController.updateRol);
  router.delete("/:idRol", rolesController.deleteRol);

  return router;
};

export default createRolesRoute;