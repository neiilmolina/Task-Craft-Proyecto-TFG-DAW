import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import IUsuariosDAO from "@/src/usuarios/dao/IUsuariosDAO";
import UsuariosModel from "@/src/usuarios/UsuariosModel";

const secretKey = process.env.JWT_SECRET as string;

export default class AuthController {
  private usuariosModel: UsuariosModel;

  constructor(usuariosDAO: IUsuariosDAO) {
    this.usuariosModel = new UsuariosModel(usuariosDAO);
  }
  // Método para hacer login
  async login(req: Request, res: Response): Promise<void> {
    console.log("Entrando en login");
    try {
      const { email, password } = req.body;
      console.log("Email y contraseña recibidos:", email, password);
      if (!email || !password) {
        res
          .status(400)
          .json({ error: "El email y la contraseña son obligatorios" });
        return;
      }

      const usuario = await this.usuariosModel.getByCredentials(
        email,
        password
      );
      console.log("Usuario encontrado:", usuario);

      if (!usuario) {
        res
          .status(404)
          .json({ error: "Usuario no encontrado o credenciales incorrectas" });
        return;
      }

      const token = jwt.sign(
        { idUsuario: usuario.idUsuario, email: usuario.email },
        secretKey,
        { expiresIn: "1h" }
      );
      console.log("Token generado:", token);

      res.status(200).json({ message: "Login exitoso", token });
    } catch (error: any) {
      console.log("Error en el login:", error.message);
      console.log("Error en el login:", error.stack);
      res.status(500).json({
        error: "Error interno del servidor",
        details: error.stack || error.message,
      });
    }
  }
}
