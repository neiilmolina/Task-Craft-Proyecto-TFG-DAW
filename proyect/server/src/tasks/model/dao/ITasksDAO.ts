import {
  Task,
  TaskCreate,
  TaskFilters,
  TaskReturn,
  TaskUpdate,
} from "task-craft-models";

export default interface ITaskDAO {
  getAll(tasksFilters?: TaskFilters): Promise<Task[]>;
  getById(idTask: string): Promise<Task | null>;
  create(idTask: string, task: TaskCreate): Promise<TaskReturn | null>;
  update(idTask: string, task: TaskUpdate): Promise<TaskReturn | null>;
  delete(idTask: string): Promise<boolean>;
}
