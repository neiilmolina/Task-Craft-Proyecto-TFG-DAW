import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET || "default_secret";
const accesCookie = process.env.KEY_ACCESS_COOKIE as string;

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies[accesCookie];

  if (!token) {
    res.status(401).json({ error: "No autenticado" });
    return;
  }
  try {
    const decoded = jwt.verify(token, secretKey) as any;
    (req as any).user.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }
}
