import { Request, Response, NextFunction, RequestHandler } from "express";
import {
  validateUsuarioCreate,
  validateUsuarioUpdate,
} from "@/src/usuarios/schemasUsuarios";
import UsuariosModel from "./UsuariosModel";
import {
  UsuarioCreate,
  UsuarioUpdate,
  LoginCredentials,
} from "@/src/usuarios/interfacesUsuarios";

export default class UsuariosController {
  constructor(private usuariosModel: UsuariosModel) {}

  // Obtener todos los usuarios
  getUsuarios: RequestHandler = async (req, res) => {
    try {
      const filters = req.query; // Obtener filtros de la query params
      const result = await this.usuariosModel.getAll(filters);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error al cargar los usuarios:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  // Obtener un usuario por su ID
  getUsuarioById: RequestHandler = async (req, res) => {
    try {
      const id = req.params.id;
      const usuario = await this.usuariosModel.getById(id);

      if (usuario) {
        res.status(200).json(usuario);
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error("Error al cargar el usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  // Crear un nuevo usuario
  signUp: RequestHandler = async (req, res) => {
    try {
      const usuarioData: UsuarioCreate = req.body;

      console.log("Request Body:", usuarioData); // Verifica el contenido del cuerpo de la solicitud

      // Validación del cuerpo de la solicitud
      const result = validateUsuarioCreate(usuarioData);
      if (!result.success) {
        res.status(400).json({ error: result.error });
        return; // Si la validación falla, termina aquí
      }

      console.log("Calling signUp model with", usuarioData); // Verifica que el modelo se está llamando

      const newUsuario = await this.usuariosModel.signUp(usuarioData); // Aquí debería llamarse
      res.status(201).json(newUsuario);
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  createUsuario: RequestHandler = async (req, res) => {
    try {
      const usuarioData: UsuarioCreate = req.body;

      console.log("Request Body:", usuarioData); // Verifica el contenido del cuerpo de la solicitud

      // Validación del cuerpo de la solicitud
      const result = validateUsuarioCreate(usuarioData);
      if (!result.success) {
        res.status(400).json({ error: result.error });
        return; // Si la validación falla, termina aquí
      }

      console.log("Calling createUsuario model with", usuarioData); // Verifica que el modelo se está llamando

      const newUsuario = await this.usuariosModel.create(usuarioData); // Aquí debería llamarse
      res.status(201).json(newUsuario); // Retorna el nuevo usuario creado
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" }); // Si ocurre un error interno, devuelve el código 500
    }
  };

  // Actualizar un usuario
  updateUsuario: RequestHandler = async (req, res) => {
    try {
      const id = req.params.id;
      const usuarioData: UsuarioUpdate = req.body;

      // Validación de los datos a actualizar
      const result = validateUsuarioUpdate(usuarioData);

      if (!result.success) {
        // Extraemos el mensaje del primer error en 'issues'
        const errorMessage =
          result.error.issues[0]?.message || "Error de validación";
        res.status(400).json({ error: errorMessage });
        return; // Detenemos la ejecución aquí si la validación falla
      }

      // Si la validación pasó, intentamos actualizar el usuario
      const updatedUsuario = await this.usuariosModel.update(id, usuarioData);

      if (updatedUsuario) {
        res.status(200).json(updatedUsuario);
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  // Eliminar un usuario
  deleteUsuario: RequestHandler = async (req, res) => {
    try {
      const id = req.params.id;
      const result = await this.usuariosModel.delete(id);

      if (result) {
        res.status(200).json({ message: "Usuario eliminado correctamente" });
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  // Cambiar la contraseña de un usuario
  changePassword: RequestHandler = async (req, res) => {
    try {
      const { newPassword } = req.body;
      const result = await this.usuariosModel.changePassword(newPassword);

      if (result) {
        res.status(200).json({ message: "Contraseña cambiada correctamente" });
      } else {
        res.status(400).json({ message: "Error al cambiar la contraseña" });
      }
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  // Restablecer correo de un usuario
  resetEmail: RequestHandler = async (req, res) => {
    try {
      const { email } = req.body;
      const result = await this.usuariosModel.resetEmail(email);

      if (result) {
        res.status(200).json({ message: "Correo restablecido correctamente" });
      } else {
        res.status(400).json({ message: "Error al restablecer el correo" });
      }
    } catch (error) {
      console.error("Error al restablecer el correo:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  // Iniciar sesión
  signIn: RequestHandler = async (req, res) => {
    try {
      const credentials: LoginCredentials = req.body;
      const authResponse = await this.usuariosModel.signIn(credentials);

      if (authResponse && authResponse.user) {
        res.status(200).json(authResponse);
      } else {
        res.status(400).json({ message: "Credenciales inválidas" });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  // Cerrar sesión
  signOut: RequestHandler = async (req, res) => {
    try {
      await this.usuariosModel.signOut();
      res.status(200).json({ message: "Sesión cerrada correctamente" });
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error);
      res.status(500).json({
        error: "Error interno del servidor",
        details: error.message, // Añadir detalles del error
      });
    }
  };

  // Restablecer la contraseña
  resetPassword: RequestHandler = async (req, res) => {
    try {
      const { email } = req.body;
      const result = await this.usuariosModel.resetPassword(email);

      if (result) {
        res
          .status(200)
          .json({ message: "Contraseña restablecida correctamente" });
      } else {
        res.status(400).json({ message: "Error al restablecer la contraseña" });
      }
    } catch (error: any) {
      console.error("Error al restablecer la contraseña:", error);
      res.status(500).json({
        error: "Error interno del servidor",
        details: error.message, // Añadir detalles del error
      });
    }
  };
}
