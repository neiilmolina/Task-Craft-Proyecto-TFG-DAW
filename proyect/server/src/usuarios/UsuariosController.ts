import { Request, Response, NextFunction, RequestHandler } from "express";
import {
  validateEmail,
  validatePassword,
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

      const result = validateUsuarioCreate(usuarioData);
      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      const newUsuario = await this.usuariosModel.signUp(usuarioData);

      // Verificar si el error es que el usuario ya existe
      if (newUsuario.error && newUsuario.error.includes("already exists")) {
        res.status(400).json({ error: "El usuario ya existe" });
        return;
      }

      res.status(201).json(newUsuario);
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  createUsuario: RequestHandler = async (req, res) => {
    try {
      const usuarioData: UsuarioCreate = req.body;
      const result = validateUsuarioCreate(usuarioData);
      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      // Llamada al modelo
      const newUsuario = await this.usuariosModel.create(usuarioData);

      res.status(201).json(newUsuario);
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  // Actualizar un usuario
  updateUsuario: RequestHandler = async (req, res) => {
    try {
      console.log("Inicio de updateUsuario");

      // Validación de la entrada
      const { success, error } = validateUsuarioUpdate(req.body);
      if (!success) {
        console.log("Validación fallida", error);
        res.status(400).json({ error }); // Simplificado
        return;
      }
      console.log("Validación exitosa");

      const { id } = req.params;
      console.log("ID del usuario a actualizar:", id);

      // Llamada al modelo para actualizar el usuario
      const updatedUser = await this.usuariosModel.update(id, req.body);
      console.log("Resultado de la actualización del usuario:", updatedUser);

      if (!updatedUser) {
        console.log("Usuario no encontrado para actualizar");
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }

      console.log("Usuario actualizado con éxito");
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error interno del servidor:", error);
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

      // Validación de la contraseña
      const validation = validatePassword(newPassword);
      if (!validation.success) {
        // Si la validación falla, devolvemos el error 400
        res.status(400).json({
          message: validation.error, // Mensaje de validación
        });
        return; // Aseguramos que no haya más ejecución
      }

      // Llama al modelo para cambiar la contraseña
      const result = await this.usuariosModel.changePassword(newPassword);

      // Si el cambio de contraseña fue exitoso
      if (result) {
        res.status(200).json({ message: "Contraseña cambiada correctamente" });
        return; // Aseguramos que no haya más ejecución
      } else {
        // Si el usuario no se encuentra
        res.status(404).json({ message: "Usuario no encontrado" });
        return; // Aseguramos que no haya más ejecución
      }
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      // Si hay un error interno
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  // Restablecer correo de un usuario
  resetEmail: RequestHandler = async (req, res) => {
    try {
      const { email } = req.body;

      // Validar el correo electrónico antes de procesarlo
      const validation = validateEmail(email);
      if (!validation.success) {
        res.status(400).json({ message: validation.error });
        return;
      }

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
    const { email, password } = req.body;

    // Validación simple
    if (!email || !password) {
      res.status(400).json({
        message: "Email y contraseña son obligatorios",
      });
    }

    try {
      const loginCredentials: LoginCredentials = { email, password };
      const result = await this.usuariosModel.signIn(loginCredentials);

      if (!result.user || result.error) {
        res.status(401).json({
          message: "Credenciales inválidas",
        });
        return;
      }

      res.status(200).json({
        message: "Inicio de sesión exitoso",
        user: result.user,
        session: result.session,
      });
      return;
    } catch (error) {
      res.status(500).json({
        error: "Error interno del servidor",
      });
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

  resetPassword: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { email } = req.body;

      const emailValidation = validateEmail(email);
      if (!emailValidation.success) {
        res.status(400).json({ message: emailValidation.error });
        return;
      }

      const result = await this.usuariosModel.resetPassword(email);

      if (result) {
        res
          .status(200)
          .json({ message: "Contraseña restablecida correctamente" });
        return;
      } else {
        res.status(400).json({ message: "Error al restablecer la contraseña" });
        return;
      }
    } catch (error: any) {
      console.error("Error al restablecer la contraseña:", error);
      res.status(500).json({
        error: "Error interno del servidor",
        details: error.message,
      });
    }
  };
}
