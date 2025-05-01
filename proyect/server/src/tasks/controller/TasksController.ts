import ITasksDAO from "@/src/tasks/model/dao/ITasksDAO";
import { RequestHandler } from "express";
import {
  TaskCreate,
  TaskFilters,
  TaskUpdate,
  validateTaskFilters,
} from "task-craft-models";
import { UUID_REGEX } from "@/src/core/constants";
import { randomUUID } from "crypto";
import TasksRepository from "@/src/tasks/model/TasksRepository";
import { validateTaskCreate, validateTaskUpdate } from "task-craft-models";
import { Temporal } from "@js-temporal/polyfill";

export default class TasksController {
  private tasksRepository: TasksRepository;

  constructor(tasksDAO: ITasksDAO) {
    this.tasksRepository = new TasksRepository(tasksDAO);
  }

  getTasks: RequestHandler = async (req, res) => {
    try {
      const tasksFilters = (req.query as TaskFilters) ?? undefined;
      const result = validateTaskFilters(tasksFilters);
      if (!result.success) {
        res.status(400).json({
          error: "Error de validación en los filtros de tareas",
          details: result.errors?.map((error) => ({
            field: error.field,
            message: error.message,
          })),
        });
        return;
      }
      if (tasksFilters) {
        res.status(400).json({ error: "El ID del user debe ser válido" });
        return;
      }

      const tasks = await this.tasksRepository.getAll(tasksFilters);

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
        res.status(400).json({ error: "El ID de la tarea debe ser válido" });
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
      // Ajustar req.body para extraer solo los valores de idState y idType
      const taskData: TaskCreate = req.body;

      const result = validateTaskCreate(taskData);

      if (!result.success) {
        res.status(400).json({
          error: "Error de validación",
          details: result.errors?.map((error) => ({
            field: error.field,
            message: error.message,
          })),
        });
        return;
      }

      const idTask = randomUUID();
      if (!UUID_REGEX.test(idTask)) {
        res.status(400).json({ error: "El ID del task debe ser válido" });
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

      // Verificación de UUID
      if (!UUID_REGEX.test(idTask)) {
        res.status(400).json({ error: "El ID de la tarea debe ser válido" });
        return;
      }

      const taskData: TaskUpdate = req.body;

      // Validación de datos de la tarea
      const result = validateTaskUpdate(taskData);
      if (!result.success) {
        res.status(400).json({
          error: "Error de validación",
          details: result.errors?.map((error) => ({
            field: error.field,
            message: error.message,
          })),
        });
        return;
      }

      // Intentando actualizar la tarea

      const taskUpdate = await this.tasksRepository.update(idTask, taskData);

      // Verificación si la tarea fue encontrada y actualizada
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
      if (!UUID_REGEX.test(idTask)) {
        res.status(400).json({ error: "El ID de la tarea debe ser válido" });
        return;
      }
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
