import { Router } from "express";
import RolesController from "@/src/roles/controller/RolesController";
import IRolesDAO from "@/src/roles/model/dao/IRolesDAO";

const createRolesRoute = (rolesDAO: IRolesDAO) => {
  const router = Router();
  const rolesController = new RolesController(rolesDAO);

  router.get("/", rolesController.getRoles);
  router.get("/:idRol", rolesController.getRoleById);
  router.post("/", rolesController.createRole);
  router.put("/:idRol", rolesController.updateRole);
  router.delete("/:idRol", rolesController.deleteRole);

  return router;
};

export default createRolesRoute;