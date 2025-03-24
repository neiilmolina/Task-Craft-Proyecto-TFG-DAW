import { Request, Response, NextFunction } from "express";

// Middleware para manejo de CORS
export const corsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200); // Responder a las solicitudes preflight
    return;
  }

  next(); // Continuar con la ejecución del siguiente middleware
};

// Middleware para manejo de errores generales
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
};
