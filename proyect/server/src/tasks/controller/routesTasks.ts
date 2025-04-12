import TasksController from "@/src/tasks/controller/TasksController";
import ITasksDAO from "@/src/tasks/model/dao/ITasksDAO";
import { Router } from "express";

const createTasksRoute = (tasksDAO: ITasksDAO) => {
  const router = Router();

  const tasksController = new TasksController(tasksDAO);

  router.get("/", tasksController.getTasks);
  router.get("/:idTask", tasksController.getTaskById);
  router.post("/", tasksController.createTask);
  router.put("/:idTask", tasksController.updateTask);
  router.delete("/:idTask", tasksController.deleteTask);

  return router;
};

export default createTasksRoute;
