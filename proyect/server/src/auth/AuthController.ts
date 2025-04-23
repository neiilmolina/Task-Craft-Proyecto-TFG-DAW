import { Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import cookies from "cookie-parser";
import IUsersDAO from "@/src/users/model/dao/IUsersDAO";
import UsersController from "@/src/users/controller/UsersController";
import { User } from "task-craft-models";
import UsersRepository from "@/src/users/model/UsersRepository";

const secretKey = process.env.JWT_SECRET as string;
const KEY_ACCESS_COOKIE = "access_token";
export default class AuthController {
  private usersModel: UsersRepository;
  private usersController: UsersController;

  constructor(usersDAO: IUsersDAO) {
    this.usersModel = new UsersRepository(usersDAO);
    this.usersController = new UsersController(usersDAO);
  }

  async getAuthenticatedUser(req: any, res: Response): Promise<void> {
    const user = req.session?.user;

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
      console.log("Email y contraseña recibidos:", email, password);

      if (!email || !password) {
        res
          .status(400)
          .json({ error: "El email y la contraseña son obligatorios" });
        return;
      }

      const user = await this.usersModel.getByCredentials(email, password);

      if (!user) {
        res
          .status(404)
          .json({ error: "User no encontrado o credenciales incorrectas" });
        return;
      }

      // Generar el JWT
      const token = jwt.sign({ ...user }, secretKey, { expiresIn: "1h" });

      // Guardar el token en una cookie
      res.cookie(KEY_ACCESS_COOKIE, token, {
        httpOnly: true, // Esto asegura que la cookie solo puede ser accesada por el servidor
        secure: process.env.NODE_ENV === "production", // Asegura que la cookie solo se envíe sobre HTTPS en producción
        expires: new Date(Date.now() + 3600 * 1000), // Expiración en 1 hora
      });

      // Responder con éxito, sin necesidad de enviar el token en el cuerpo
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
      res.clearCookie(KEY_ACCESS_COOKIE);
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
        res.status(403).json({ error: "Acceso denegado" }); // Mejor usar 403 si está autenticado pero no autorizado
        return;
      }

      res.status(200).json({ message: "Acceso autorizado" });
    } catch (error: any) {
      console.error("Error en ruta protegida:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}
