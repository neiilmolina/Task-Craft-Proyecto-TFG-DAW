import IFriendsHasTasksDAO from "@/src/friends_has_tasks/model/dao/IFriendsHasTasksDAO";
import { RequestHandler } from "express";
import {
  FriendHasTasksCreate,
  FriendHasTasksFilters,
  validateFriendHasTasksCreate,
  validateFriendHasTasksFilters,
} from "task-craft-models";
import FriendsHasTasksRepository from "@/src/friends_has_tasks/model/FriendsHasTasksRepository";
import { UUID_REGEX } from "@/src/core/constants";
import { randomUUID } from "crypto";

export default class FriendsHasTasksHTTPController {
  private friendsHasTasksRepository: FriendsHasTasksRepository;
  constructor(friendsHasTasksDAO: IFriendsHasTasksDAO) {
    this.friendsHasTasksRepository = new FriendsHasTasksRepository(
      friendsHasTasksDAO
    );
  }

  getFriendsHasTasks: RequestHandler = async (req, res) => {
    try {
      const filters: FriendHasTasksFilters = {
        ...req.query,
        friendHasTaskRequestState:
          req.query.friendHasTaskRequestState === "true"
            ? true
            : req.query.friendHasTaskRequestState === "false"
            ? false
            : undefined,
      };

      const result = validateFriendHasTasksFilters(filters);

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

      const friends = await this.friendsHasTasksRepository.getAll(filters);

      if (!friends) {
        res.status(404).json({ error: "No se encontraron tareas compartidas" });
        return;
      }
      res.status(200).json(friends);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
  };

  getFriendsHasTasksById: RequestHandler = async (req, res) => {
    try {
      console.log("req.params.idFriendsHasTasks", req.params.idFriendsHasTasks);
      const idFriendsHasTasks = req.params.idFriendsHasTasks;
      if (!UUID_REGEX.test(idFriendsHasTasks)) {
        res
          .status(400)
          .json({ error: "El ID de la tarea compartida debe ser válido" });
        return;
      }

      const sharedTasks = await this.friendsHasTasksRepository.getById(
        idFriendsHasTasks
      );

      if (!sharedTasks) {
        res.status(404).json({ error: "Tarea compartida no encontrada" });
        return;
      }

      res.status(200).json(sharedTasks);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
  };

  createFriendsHasTasks: RequestHandler = async (req, res) => {
    try {
      const friendsHasTasksData: FriendHasTasksCreate = req.body;

      console.log("friendsHasTasksData:", friendsHasTasksData);
      const result = validateFriendHasTasksCreate(friendsHasTasksData);
      console.log("result:", result);
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

      const idFriendsHasTasks = randomUUID();
      if (!UUID_REGEX.test(idFriendsHasTasks)) {
        res
          .status(400)
          .json({ error: "El ID de la tarea compartida debe ser válido" });
        return;
      }

      const newFriend = await this.friendsHasTasksRepository.create(
        idFriendsHasTasks,
        friendsHasTasksData
      );

      if (!newFriend) {
        res.status(500).json({ error: "Error al crear la tarea compartida" });
        return;
      }

      res.status(200).json(newFriend);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  updateFriendsHasTasks: RequestHandler = async (req, res) => {
    try {
      const idFriendsHasTasks = req.params.idFriendsHasTasks;

      // Verificación de UUID
      if (!UUID_REGEX.test(idFriendsHasTasks)) {
        res
          .status(400)
          .json({ error: "El ID de la tarea compartida debe ser válido" });
        return;
      }

      const friendHasTasks = await this.friendsHasTasksRepository.update(
        idFriendsHasTasks
      );

      // Verificación si la tarea fue encontrada y actualizada
      if (!friendHasTasks) {
        res.status(404).json({ error: "Tarea compartida no encontrada" });
        return;
      }

      res.status(200).json(friendHasTasks);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  deleteFriendsHasTasks: RequestHandler = async (req, res) => {
    try {
      const idFriendsHasTasks = req.params.idFriendsHasTasks;
      if (!UUID_REGEX.test(idFriendsHasTasks)) {
        res
          .status(400)
          .json({ error: "El ID de la tarea compartida debe ser válido" });
        return;
      }
      const sharedTasks = await this.friendsHasTasksRepository.delete(
        idFriendsHasTasks
      );

      if (!sharedTasks) {
        res.status(404).json({ error: "Tarea compartida no encontrada" });
        return;
      }

      res.status(200).json(sharedTasks);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}
