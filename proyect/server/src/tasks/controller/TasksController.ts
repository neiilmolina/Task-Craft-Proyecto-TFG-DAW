import ITasksDAO from "@/src/tasks/model/dao/ITasksDAO";
import { RequestHandler } from "express";
import {
  TaskCreate,
  TaskUpdate,
} from "@/src/tasks/model/interfaces/interfacesTasks";
import { UUID_REGEX } from "@/src/core/constants";
import { randomUUID } from "crypto";
import TasksRepository from "@/src/tasks/model/TasksRepository";
import {
  validateTaskCreate,
  validateTaskUpdate,
} from "@/src/tasks/model/interfaces/schemasTasks";

export default class TasksController {
  private tasksRepository: TasksRepository;

  constructor(private tasksDAO: ITasksDAO) {
    this.tasksRepository = new TasksRepository(tasksDAO);
  }

  getTasks: RequestHandler = async (req, res) => {
    try {
      const idUser = (req.query.idUser as string) ?? undefined;

      if (idUser && !UUID_REGEX.test(idUser)) {
        res.status(400).json({ error: "El ID del user debe ser válido" });
        return;
      }

      const tasks = await this.tasksDAO.getAll(idUser);

      if (!tasks) {
        res.status(404).json({ error: "No se encontraron tareas" });
        return;
      }
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
  };

  getTaskById: RequestHandler = async (req, res) => {
    try {
      const idTask = req.params.idTask;
      if (!UUID_REGEX.test(idTask)) {
        res.status(400).json({ error: "El ID del user debe ser válido" });
        return;
      }

      const task = await this.tasksRepository.getById(idTask);

      if (!task) {
        res.status(404).json({ error: "Tarea no encontrada" });
        return;
      }

      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
  };

  createTask: RequestHandler = async (req, res) => {
    try {
      const taskData: TaskCreate = req.body;
      const result = validateTaskCreate(taskData);
      if (!result.success) {
        res.status(400).json({ error: result.errors });
        return;
      }

      const idTask = randomUUID();
      if (!UUID_REGEX.test(idTask)) {
        res.status(400).json({ error: "El ID del user debe ser válido" });
        return;
      }

      const newTask = await this.tasksRepository.create(idTask, taskData);

      if (!newTask) {
        res.status(500).json({ error: "Error al crear la tarea" });
        return;
      }

      res.status(200).json(newTask);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
  
  updateTask: RequestHandler = async (req, res) => {
    try {
      const idTask = req.params.idTask;
      if (!UUID_REGEX.test(idTask)) {
        res.status(400).json({ error: "El ID del user debe ser válido" });
        return;
      }
      const taskData: TaskUpdate = req.body;

      const result = validateTaskUpdate(taskData);
      if (!result.success) {
        res.status(400).json({ error: result.errors });
        return;
      }

      const taskUpdate = await this.tasksRepository.update(idTask, taskData);

      if (!taskUpdate) {
        res.status(404).json({ error: "Tarea no encontrada" });
        return;
      }

      res.status(200).json(taskUpdate);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
  deleteTask: RequestHandler = async (req, res) => {
    try {
      const idTask = req.params.idTask;

      const task = await this.tasksRepository.delete(idTask);

      if (!task) {
        res.status(404).json({ error: "Tarea no encontrada" });
        return;
      }

      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}
