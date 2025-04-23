import IFriendsDAO from "@/src/friends/model/dao/IFriendsDAO";
import { RequestHandler } from "express";
import {
  FriendCreate,
  Friend,
  FriendReturn,
  FriendFilters,
} from "task-craft-models";
import { UUID_REGEX } from "@/src/core/constants";
import { randomUUID } from "crypto";
import FriendsRepository from "@/src/friends/model/FriendsRepository";
import {
  validateFriendCreate,
  validateFriendFilters,
} from "task-craft-models";

export default class FriendsHTTPController {
  private friendsRepository: FriendsRepository;

  constructor(friendsDAO: IFriendsDAO) {
    this.friendsRepository = new FriendsRepository(friendsDAO);
  }

  getFriends: RequestHandler = async (req, res) => {
    try {
      const filters: FriendFilters = {
        ...req.query,
        friendRequestState:
          req.query.friendRequestState === "true"
            ? true
            : req.query.friendRequestState === "false"
            ? false
            : undefined,
      };

      const result = validateFriendFilters(filters);

      if (!result.success) {
        res.status(400).json({ error: result.errors });
        return;
      }
      const { friendRequestState } = filters;

      if (friendRequestState) {
      }

      const friends = await this.friendsRepository.getAll(filters);

      if (!friends) {
        res.status(404).json({ error: "No se encontraron tareas" });
        return;
      }
      res.status(200).json(friends);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
  };

  getFriendById: RequestHandler = async (req, res) => {
    try {
      const idFriend = req.params.idFriend;
      if (!UUID_REGEX.test(idFriend)) {
        res.status(400).json({ error: "El ID de la amistad debe ser válido" });
        return;
      }

      const friend = await this.friendsRepository.getById(idFriend);

      if (!friend) {
        res.status(404).json({ error: "Amistad no encontrada" });
        return;
      }

      res.status(200).json(friend);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
  };

  createFriend: RequestHandler = async (req, res) => {
    try {
      const friendData: FriendCreate = req.body;

      console.log("friendData:", friendData);
      const result = validateFriendCreate(friendData);
      console.log("result:", result);
      if (!result.success) {
        res.status(400).json({ error: result.errors });
        return;
      }

      const idFriend = randomUUID();
      if (!UUID_REGEX.test(idFriend)) {
        res.status(400).json({ error: "El ID de la amistad debe ser válido" });
        return;
      }

      const newFriend = await this.friendsRepository.create(
        idFriend,
        friendData
      );

      if (!newFriend) {
        res.status(500).json({ error: "Error al crear la amistad" });
        return;
      }

      res.status(200).json(newFriend);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  updateFriend: RequestHandler = async (req, res) => {
    try {
      const idFriend = req.params.idFriend;

      // Verificación de UUID
      if (!UUID_REGEX.test(idFriend)) {
        res.status(400).json({ error: "El ID de la amistad debe ser válido" });
        return;
      }

      const friendUpdate = await this.friendsRepository.update(idFriend);

      // Verificación si la tarea fue encontrada y actualizada
      if (!friendUpdate) {
        res.status(404).json({ error: "Amistad no encontrada" });
        return;
      }

      res.status(200).json(friendUpdate);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  deleteFriend: RequestHandler = async (req, res) => {
    try {
      const idFriend = req.params.idFriend;
      if (!UUID_REGEX.test(idFriend)) {
        res.status(400).json({ error: "El ID de la amistad debe ser válido" });
        return;
      }
      const friend = await this.friendsRepository.delete(idFriend);

      if (!friend) {
        res.status(404).json({ error: "Amistad no encontrada" });
        return;
      }

      res.status(200).json(friend);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}
