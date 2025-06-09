import { Request, Response, NextFunction } from "express";

const allowedOrigins = [
  "http://localhost:5173",
  "http://tfg-daw-frontend.s3-website.eu-north-1.amazonaws.com",
];

export const corsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const origin = req.headers.origin as string;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
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
