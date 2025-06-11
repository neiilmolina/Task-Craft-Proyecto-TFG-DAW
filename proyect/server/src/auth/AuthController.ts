import { Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import IUsersDAO from "@/src/users/model/dao/IUsersDAO";
import UsersController from "@/src/users/controller/UsersController";
import {
  User,
  validateEmail,
  validatePassword,
  validateUserName,
} from "task-craft-models";
import UsersRepository from "@/src/users/model/UsersRepository";
import { UUID_REGEX } from "../core/constants";
import bcrypt from "bcryptjs";

const secretKey = process.env.JWT_SECRET as string;
const accesCookie = process.env.KEY_ACCESS_COOKIE as string;

export default class AuthController {
  private usersRepository: UsersRepository;
  private usersController: UsersController;

  constructor(usersDAO: IUsersDAO) {
    this.usersRepository = new UsersRepository(usersDAO);
    this.usersController = new UsersController(usersDAO);
  }

  async getAuthenticatedUser(req: any, res: Response): Promise<void> {
    const user = req.session?.user;
    console.log("user", user);

    if (!user) {
      res.status(401).json({ error: "No autenticado" });
      return;
    }

    res.status(200).json({ user });
  }

  register: RequestHandler = (req, res, next) =>
    this.usersController.createUser(req, res, next);

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res
          .status(400)
          .json({ error: "El email y la contraseña son obligatorios" });
        return;
      }

      const user = await this.usersRepository.getByCredentials(email, password);
      console.log("user", user);
      if (!user) {
        res
          .status(404)
          .json({ error: "Usuario no encontrado o credenciales incorrectas" });
        return;
      }

      // Generar el JWT
      const token = jwt.sign({ ...user }, secretKey, { expiresIn: "1h" });
      console.log("token", token);

      // Guardar el token en una cookie
      res.cookie(accesCookie, token, {
        httpOnly: true, // Esto asegura que la cookie solo puede ser accesada por el servidor
        //secure: process.env.NODE_ENV === "production", Asegura que la cookie solo se envíe sobre HTTPS en producción
        // sameSite: "none",
        sameSite: "lax",
        expires: new Date(Date.now() + 3600 * 1000), // Expiración en 1 hora
      });

      res.status(200).json({ message: "Login exitoso" });
    } catch (error: any) {
      console.error("Error en el login:", error);
      res.status(500).json({
        error: "Error interno del servidor",
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie(accesCookie);
      res.status(200).json({ message: "Logout exitoso" });
    } catch (error: any) {
      res.status(500).json({
        error: "Error interno del servidor",
      });
    }
  }

  async protected(req: any, res: Response): Promise<void> {
    try {
      const user: User | null = req.session?.user ?? null;

      if (!user) {
        res.status(401).json({ error: "No autenticado" });
        return;
      }

      if (user.role.idRole !== 2) {
        res.status(403).json({ error: "Acceso denegado" });
        return;
      }

      res.status(200).json({ message: "Acceso autorizado" });
    } catch (error: any) {
      console.error("Error en ruta protegida:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies[accesCookie];

      if (!token) {
        res.status(401).json({ error: "Token inválido o expirado" });
        return;
      }

      // Verificar el token
      const decoded = jwt.verify(token, secretKey) as any;
      const { exp, iat, ...rest } = decoded;

      // Generar un nuevo token con una nueva expiración
      const newToken = jwt.sign({ ...rest }, secretKey, { expiresIn: "1h" });

      // Actualizar la cookie con el nuevo token
      res.cookie(accesCookie, newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 3600 * 1000), // Expiración en 1 hora
      });

      res.status(200).json({ message: "Token actualizado con éxito" });
    } catch (error: any) {
      console.error("Error al actualizar el token:", error);
      res.status(500).json({ error: "Error al refrescar el token" });
    }
  }

  async changePassword(req: any, res: Response): Promise<void> {
    try {
      const user: User | null = req.session?.user ?? null;
      const idUser = user?.idUser;
      const newPassword: string = req.body.newPassword;
      const actualPassword: string = req.body.actualPassword;
      const sessionEmail = user?.email;

      if (!idUser || !sessionEmail) {
        res.status(400).json({ error: "No hay user autenticado" });
        return;
      }

      if (actualPassword === newPassword) {
        res.status(400).json({
          error: "La contraseña actual y la nueva no deben de ser iguales",
        });
        return;
      }

      const userCredentials = await this.usersRepository.getByCredentials(
        sessionEmail,
        actualPassword
      );

      if (!userCredentials) {
        res.status(404).json({ error: "Contraseña incorrecta" });
        return;
      }

      if (!UUID_REGEX.test(idUser)) {
        res.status(400).json({ error: "El ID del user debe ser válido" });
        return;
      }
      const result = validatePassword(newPassword);

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

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const userUpdate = await this.usersRepository.updatePassword(
        idUser,
        hashedPassword
      );

      if (!userUpdate) {
        res.status(404).json({ error: "El user no se ha encontrado" });
        return;
      }

      res.clearCookie(accesCookie);

      res.status(200).json({
        message:
          "Contraseña actualizada con éxito. Por seguridad, vuelve a iniciar sesión.",
      });
    } catch (error: any) {
      if (error.message === "User not found") {
        res.status(404).json({ error: "El user no se ha encontrado" });
      } else {
        console.error("Error al actualizar el user:", error);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    }
  }

  async changeEmail(req: any, res: Response): Promise<void> {
    try {
      const user: User | null = req.session?.user ?? null;
      const idUser = user?.idUser;
      const sessionEmail = user?.email;

      const newEmail: string = req.body.newEmail;
      const actualEmail: string = req.body.actualEmail;

      if (!idUser) {
        res.status(400).json({ error: "No hay user autenticado" });
        return;
      }

      if (!UUID_REGEX.test(idUser)) {
        res.status(400).json({ error: "El ID del user debe ser válido" });
        return;
      }

      if (sessionEmail !== actualEmail) {
        res.status(400).json({
          error: "No has introducido tu correo actual",
        });
        return;
      }

      if (newEmail === sessionEmail) {
        res.status(400).json({
          error: "Introduce un correo distinto al actual",
        });
        return;
      }

      const result = validateEmail(newEmail);

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

      const userUpdate = await this.usersRepository.updateEmail(
        idUser,
        newEmail
      );

      if (!userUpdate) {
        res.status(404).json({ error: "El user no se ha encontrado" });
        return;
      }

      res.clearCookie(accesCookie);

      res.status(200).json({
        message:
          "Correo actualizado con éxito. Por seguridad, vuelve a iniciar sesión.",
      });
    } catch (error: any) {
      if (error.message === "User not found") {
        res.status(404).json({ error: "El user no se ha encontrado" });
      } else if (
        error.code === "ER_DUP_ENTRY" &&
        error.message.includes("email")
      ) {
        res.status(409).json({ error: "El email ya está en uso." });
      } else {
        console.error("Error al actualizar el user:", error);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    }
  }

  async changeUserName(req: any, res: Response): Promise<void> {
    try {
      const user: User | null = req.session?.user ?? null;
      const idUser = user?.idUser;
      const sessionUserName = user?.userName;

      const newUserName: string = req.body.newUserName;
      const actualUserName: string = req.body.actualUserName;

      if (!idUser) {
        res.status(400).json({ error: "No hay user autenticado" });
        return;
      }

      if (actualUserName !== sessionUserName) {
        res.status(400).json({
          error: "No has introducido tu nombre de usuario actual",
        });
        return;
      }

      if (newUserName === sessionUserName) {
        res.status(400).json({
          error: "Introduce un nombre de usuario distinto al actual",
        });
        return;
      }

      if (!UUID_REGEX.test(idUser)) {
        res.status(400).json({ error: "El ID del user debe ser válido" });
        return;
      }
      const result = validateUserName(newUserName);

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

      const userUpdate = await this.usersRepository.updateUserName(
        idUser,
        newUserName
      );

      if (!userUpdate) {
        res.status(404).json({ error: "El user no se ha encontrado" });
        return;
      }

      // Resto del código para actualizar el token...
      const token = req.cookies[accesCookie];

      if (!token) {
        res.status(401).json({ error: "Token inválido o expirado" });
        return;
      }

      const decoded = jwt.verify(token, secretKey) as any;
      const { exp, iat, ...rest } = decoded;

      const newToken = jwt.sign({ ...rest, userName: newUserName }, secretKey, {
        expiresIn: "1h",
      });

      res.cookie(accesCookie, newToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 3600 * 1000),
      });

      res.status(200).json({
        message: "Nombre de usuario actualizado con éxito",
      });
    } catch (error: any) {
      if (error.message === "User not found") {
        res.status(404).json({ error: "El user no se ha encontrado" });
      } else if (
        error.code === "ER_DUP_ENTRY" &&
        error.message.includes("nombreUsuario")
      ) {
        res.status(409).json({ error: "El nombre de usuario ya está en uso." });
      } else {
        console.error("Error al actualizar el user:", error);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    }
  }

  delete = async (req: any, res: Response): Promise<void> => {
    try {
      const user: User | null = req.session?.user ?? null;
      const idUser = user?.idUser;
      const sessionEmail = user?.email;

      const { email, password }: { email: string; password: string } = req.body;

      if (sessionEmail !== email) {
        res.status(404).json({ error: "Estas utilizando otras credenciales" });
        return;
      }

      if (!email || !password) {
        res
          .status(400)
          .json({ error: "El email y la contraseña son obligatorios" });
        return;
      }

      const userCredentials = await this.usersRepository.getByCredentials(
        email,
        password
      );

      if (!userCredentials) {
        res
          .status(404)
          .json({ error: "Usuario no encontrado o credenciales incorrectas" });
        return;
      }

      if (!idUser) {
        res.status(400).json({ error: "ID de user es requerido" });
        return;
      }

      if (!UUID_REGEX.test(idUser)) {
        res.status(400).json({ error: "El ID del user debe ser válido" });
        return;
      }

      const deletedUser = await this.usersRepository.delete(idUser);

      if (!deletedUser) {
        res.status(404).json({ error: "User no encontrado" });
        return;
      }

      res.clearCookie(accesCookie);
      res.status(200).json(deletedUser);
    } catch (error) {
      console.error("Error al eliminar el user:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}
