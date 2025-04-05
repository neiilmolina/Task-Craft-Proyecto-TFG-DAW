import jwt from "jsonwebtoken";
import { Response } from "express";

const secretKey = process.env.JWT_SECRET as string;

/**
 * Middleware para verificar el token JWT
 * y establecer la sesión del usuario en req.session
 * en caso de que el token sea válido.
 * En caso de que el token sea inválido, se devuelve un error.
 */

export default function authMiddleware(
  req: any,
  res: Response,
  next: () => void
) {
  const token = req.cookies.access_token; // Acceder a la cookie del token  
  req.session = { user: null };

  try {
    if (!token) {
      res.status(401).json({ error: "No se ha proporcionado un token" });
      return;
    }
    const data = jwt.verify(token, secretKey);
    req.session.user = data;
  } catch {}

  next();
}
