import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"; // Usando JWT como ejemplo

const secretKey = "tu_clave_secreta"; // Asegúrate de mantener esto seguro

// Middleware de autenticación
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Se espera que el token venga como "Bearer <token>"

  if (!token) {
    res
      .status(401)
      .json({ error: "No se ha proporcionado un token de autenticación" });
    return;
  }

  try {
    // Verificamos el token usando la clave secreta
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Podemos guardar los datos del usuario decodificados en la solicitud
    next(); // Continuar con el siguiente middleware o ruta
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};
