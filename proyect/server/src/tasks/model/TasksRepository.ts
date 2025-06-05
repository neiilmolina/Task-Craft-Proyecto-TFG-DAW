import { TaskCreate, TaskFilters, TaskUpdate } from "task-craft-models";
import ITasksDAO from "@/src/tasks/model/dao/ITasksDAO";

export default class TasksRepository {
  constructor(private tasksDAO: ITasksDAO) {}

  getAll(tasksFilters?: TaskFilters) {
    return this.tasksDAO.getAll(tasksFilters);
  }
  getById(idTask: string) {
    return this.tasksDAO.getById(idTask);
  }
  create(idTask: string, task: TaskCreate) {
    return this.tasksDAO.create(idTask, task);
  }
  update(idTask: string, task: TaskUpdate) {
    return this.tasksDAO.update(idTask, task);
  }
  delete(idTask: string) {
    return this.tasksDAO.delete(idTask);
  }
}
