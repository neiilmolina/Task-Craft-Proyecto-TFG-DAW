import { Router } from "express";
import RolesController from "@/src/roles/RolesController";
import RolesModel from "@/src/roles/RolesModel";

const createRolesRoute = (rolesModel: RolesModel) => {
  const router = Router();
  const rolesController = new RolesController(rolesModel);

  router.get("/", rolesController.getRoles);
  router.get("/:idRol", rolesController.getRolById);
  router.post("/", rolesController.createRol);
  router.put("/:idRol", rolesController.updateRol);
  router.delete("/:idRol", rolesController.deleteRol);

  return router;
};

export default createRolesRoute;