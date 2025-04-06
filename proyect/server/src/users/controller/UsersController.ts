import UsersRepository from "@/src/users/model/UsersRepository";
import IUsuariosDAO from "@/src/users/model/dao/IUsersDAO";
import { RequestHandler } from "express";
import {
  validatePassword,
  validateUsuarioCreate,
  validateUsuarioUpdate,
} from "@/src/users/model/interfaces/schemasUsuarios";
import {
  UsuarioCreate,
  UsuarioUpdate,
} from "@/src/users/model/interfaces/interfacesUsers";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { UUID_REGEX } from "@/src/core/constants";

export default class UsuariosController {
  private usersRepository: UsersRepository;

  constructor(usuariosDAO: IUsuariosDAO) {
    this.usersRepository = new UsersRepository(usuariosDAO);
  }

  getUsers: RequestHandler = async (req, res) => {
    try {
      const idRol = req.query.idRol
        ? parseInt(req.query.idRol as string)
        : undefined;
      if (idRol !== undefined && isNaN(idRol)) {
        res
          .status(400)
          .json({ error: "El ID del rol debe ser un número válido" });
        return;
      }
      const users = await this.usersRepository.getAll(idRol);
      res.status(200).json(users);
      return;
    } catch (error) {
      console.error("Error al cargar los users:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
  };

  getUsuarioById: RequestHandler = async (req, res) => {
    try {
      const idUsuario = req.params.idUsuario;
      if (!UUID_REGEX.test(idUsuario)) {
        res.status(400).json({ error: "El ID del usuario debe ser válido" });
        return;
      }

      const usuario = await this.usersRepository.getById(idUsuario);

      if (!usuario) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }

      res.status(200).json(usuario);
      return;
    } catch (error) {
      console.error("Error al cargar el usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
  };

  getUsuarioByCredentials: RequestHandler = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          error: "El email y la contraseña son obligatorios",
        });
        return;
      }

      const usuario = await this.usersRepository.getByCredentials(
        email,
        password
      );

      if (!usuario) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }

      res.status(200).json(usuario);
    } catch (error) {
      console.error("Error al autenticar el usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  createUsuario: RequestHandler = async (req, res) => {
    try {
      const usuarioData: UsuarioCreate = req.body;

      const result = validateUsuarioCreate(usuarioData);

      // Validar campos obligatorios antes de continuar
      if (!result.success) {
        res.status(400).json({ error: "Todos los campos son obligatorios" });
        return;
      }

      const { password } = usuarioData;
      const idUsuario = randomUUID(); // Generamos el UUID sin necesidad de validarlo con regex

      const hashedPassword = await bcrypt.hash(password, 10);

      const usuarioConPasswordEncriptado = {
        ...usuarioData,
        idUsuario,
        password: hashedPassword,
      };

      const newUsuario = await this.usersRepository.create(
        idUsuario,
        usuarioConPasswordEncriptado
      );

      if (!newUsuario) {
        res.status(500).json({ error: "El usuario no se ha podido crear" });
        return;
      }

      res.status(200).json(newUsuario);
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  updateUsuario: RequestHandler = async (req, res) => {
    try {
      const idUsuario = req.params.idUsuario;
      const usuarioData: UsuarioUpdate = req.body;
      const result = validateUsuarioUpdate(usuarioData);

      if (!UUID_REGEX.test(idUsuario)) {
        res.status(400).json({ error: "El ID del usuario debe ser válido" });
        return;
      }

      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      const usuarioUpdate = await this.usersRepository.update(
        idUsuario,
        usuarioData
      );

      if (!usuarioUpdate) {
        res.status(404).json({ error: "El usuario no se ha encontrado" });
        return;
      }

      res.status(200).json(usuarioUpdate);
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  updateUsuarioPassword: RequestHandler = async (req, res) => {
    try {
      const idUsuario = req.params.idUsuario;
      const password: string = req.body.password;
      const result = validatePassword(password);

      if (!UUID_REGEX.test(idUsuario)) {
        res.status(400).json({ error: "El ID del usuario debe ser válido" });
        return;
      }

      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const usuarioUpdate = await this.usersRepository.updatePassword(
        idUsuario,
        hashedPassword
      );

      if (!usuarioUpdate) {
        res.status(404).json({ error: "El usuario no se ha encontrado" });
        return;
      }

      res.status(200).json(usuarioUpdate);
    } catch (error: any) {
      if (error.message === "User not found") {
        res.status(404).json({ error: "El usuario no se ha encontrado" });
      } else {
        console.error("Error al actualizar el usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    }
  };

  deleteUsuario: RequestHandler = async (req, res) => {
    try {
      const idUsuario = req.params.idUsuario;

      // Verificar si el idUsuario está presente
      if (!idUsuario) {
        res.status(400).json({ error: "ID de usuario es requerido" });
        return;
      }

      // Verificar si el idUsuario es un UUID válido
      if (!UUID_REGEX.test(idUsuario)) {
        res.status(400).json({ error: "El ID del usuario debe ser válido" });
        return;
      }

      const usuario = await this.usersRepository.delete(idUsuario);

      if (!usuario) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }

      res.status(200).json(usuario);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}
