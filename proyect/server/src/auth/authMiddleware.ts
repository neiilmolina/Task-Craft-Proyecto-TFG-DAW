import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET || "default_secret";
const accesCookie = process.env.KEY_ACCESS_COOKIE as string;

export default function authMiddleware(
  req: any,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies[accesCookie];
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
