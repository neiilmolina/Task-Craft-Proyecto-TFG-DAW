import {
  Task,
  TaskCreate,
  TaskReturn,
  TaskUpdate,
} from "task-craft-models";

export default interface ITaskDAO {
  getAll(idUser?: string): Promise<Task[]>;
  getById(idTask: string): Promise<Task | null>;
  create(idTask: string, task: TaskCreate): Promise<TaskReturn | null>;
  update(idTask: string, task: TaskUpdate): Promise<TaskReturn | null>;
  delete(idTask: string): Promise<boolean>;
}
