import UsuariosModel from "@/src/usuarios/UsuariosModel";
import IUsuariosDAO from "@/src/usuarios/dao/IUsuariosDAO";
import { RequestHandler } from "express";
import {
  validateUsuarioCreate,
  validateUsuarioUpdate,
} from "@/src/usuarios/schemasUsuarios";
import {
  UsuarioCreate,
  UsuarioUpdate,
} from "@/src/usuarios/interfacesUsuarios";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { UUID_REGEX } from "@/src/core/constants";

export default class UsuariosController {
  private usuariosModel: UsuariosModel;

  constructor(usuariosDAO: IUsuariosDAO) {
    this.usuariosModel = new UsuariosModel(usuariosDAO);
  }

  getUsuarios: RequestHandler = async (req, res) => {
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
      const usuarios = await this.usuariosModel.getAll(idRol);
      res.status(200).json(usuarios);
      return;
    } catch (error) {
      console.error("Error al cargar los usuarios:", error);
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

      const usuario = await this.usuariosModel.getById(idUsuario);

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

      const newUsuario = await this.usuariosModel.create(
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
      const usuarioData: UsuarioUpdate = { ...req.body, idUsuario: idUsuario };
      const result = validateUsuarioUpdate(usuarioData);

      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      const usuarioUpdate = await this.usuariosModel.update(
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

      const usuario = await this.usuariosModel.delete(idUsuario);

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
