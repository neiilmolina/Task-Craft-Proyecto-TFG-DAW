import UsersRepository from "@/src/users/model/UsersRepository";
import IUsersDAO from "@/src/users/model/dao/IUsersDAO";
import { RequestHandler } from "express";
import {
  validatePassword,
  validateUserCreate,
  validateUserUpdate,
} from "@/src/users/model/interfaces/schemasUsers";
import {
  UserCreate,
  UserUpdate,
} from "@/src/users/model/interfaces/interfacesUsers";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { UUID_REGEX } from "@/src/core/constants";

export default class UsersController {
  private usersRepository: UsersRepository;

  constructor(usersDAO: IUsersDAO) {
    this.usersRepository = new UsersRepository(usersDAO);
  }

  getUsers: RequestHandler = async (req, res) => {
    try {
      const idRol = req.query.idRol
        ? parseInt(req.query.idRol as string)
        : undefined;

      const stringSearch = req.query.stringSearch
        ? req.query.stringSearch as string
        : undefined;
      if (idRol !== undefined && isNaN(idRol)) {
        res
          .status(400)
          .json({ error: "El ID del rol debe ser un número válido" });
        return;
      }
      const users = await this.usersRepository.getAll(idRol, stringSearch);
      res.status(200).json(users);
      return;
    } catch (error) {
      console.error("Error al cargar los users:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
  };

  getUserById: RequestHandler = async (req, res) => {
    try {
      const idUser = req.params.idUser;
      if (!UUID_REGEX.test(idUser)) {
        res.status(400).json({ error: "El ID del user debe ser válido" });
        return;
      }

      const user = await this.usersRepository.getById(idUser);

      if (!user) {
        res.status(404).json({ error: "User no encontrado" });
        return;
      }

      res.status(200).json(user);
      return;
    } catch (error) {
      console.error("Error al cargar el user:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
  };

  // getUserByCredentials: RequestHandler = async (req, res) => {
  //   try {
  //     const { email, password } = req.body;

  //     if (!email || !password) {
  //       res.status(400).json({
  //         error: "El email y la contraseña son obligatorios",
  //       });
  //       return;
  //     }

  //     const user = await this.usersRepository.getByCredentials(email, password);

  //     if (!user) {
  //       res.status(404).json({ error: "User no encontrado" });
  //       return;
  //     }

  //     res.status(200).json(user);
  //   } catch (error) {
  //     console.error("Error al autenticar el user:", error);
  //     res.status(500).json({ error: "Error interno del servidor" });
  //   }
  // };

  createUser: RequestHandler = async (req, res) => {
    try {
      const userData: UserCreate = req.body;

      const result = validateUserCreate(userData);

      // Validar campos obligatorios antes de continuar
      if (!result.success) {
        res.status(400).json({ error: "Todos los campos son obligatorios" });
        return;
      }

      const { password } = userData;
      const idUser = randomUUID(); // Generamos el UUID sin necesidad de validarlo con regex

      const hashedPassword = await bcrypt.hash(password, 10);

      const userConPasswordEncriptado = {
        ...userData,
        idUser,
        password: hashedPassword,
      };

      const newUser = await this.usersRepository.create(
        idUser,
        userConPasswordEncriptado
      );

      if (!newUser) {
        res.status(500).json({ error: "El user no se ha podido crear" });
        return;
      }

      res.status(200).json(newUser);
    } catch (error) {
      console.error("Error al crear el user:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  updateUser: RequestHandler = async (req, res) => {
    try {
      const idUser = req.params.idUser;
      const userData: UserUpdate = req.body;
      const result = validateUserUpdate(userData);

      if (!UUID_REGEX.test(idUser)) {
        res.status(400).json({ error: "El ID del user debe ser válido" });
        return;
      }

      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      const userUpdate = await this.usersRepository.update(idUser, userData);

      if (!userUpdate) {
        res.status(404).json({ error: "El user no se ha encontrado" });
        return;
      }

      res.status(200).json(userUpdate);
    } catch (error) {
      console.error("Error al actualizar el user:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  // updateUserPassword: RequestHandler = async (req, res) => {
  //   try {
  //     const idUser = req.params.idUser;
  //     const password: string = req.body.password;
  //     const result = validatePassword(password);

  //     if (!UUID_REGEX.test(idUser)) {
  //       res.status(400).json({ error: "El ID del user debe ser válido" });
  //       return;
  //     }

  //     if (!result.success) {
  //       res.status(400).json({ error: result.error });
  //       return;
  //     }

  //     const hashedPassword = await bcrypt.hash(password, 10);
  //     const userUpdate = await this.usersRepository.updatePassword(
  //       idUser,
  //       hashedPassword
  //     );

  //     if (!userUpdate) {
  //       res.status(404).json({ error: "El user no se ha encontrado" });
  //       return;
  //     }

  //     res.status(200).json(userUpdate);
  //   } catch (error: any) {
  //     if (error.message === "User not found") {
  //       res.status(404).json({ error: "El user no se ha encontrado" });
  //     } else {
  //       console.error("Error al actualizar el user:", error);
  //       res.status(500).json({ error: "Error interno del servidor" });
  //     }
  //   }
  // };

  deleteUser: RequestHandler = async (req, res) => {
    try {
      const idUser = req.params.idUser;

      // Verificar si el idUser está presente
      if (!idUser) {
        res.status(400).json({ error: "ID de user es requerido" });
        return;
      }

      // Verificar si el idUser es un UUID válido
      if (!UUID_REGEX.test(idUser)) {
        res.status(400).json({ error: "El ID del user debe ser válido" });
        return;
      }

      const user = await this.usersRepository.delete(idUser);

      if (!user) {
        res.status(404).json({ error: "User no encontrado" });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error al eliminar el user:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}
