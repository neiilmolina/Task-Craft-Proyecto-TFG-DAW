import "dotenv/config";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  const { name } = req.query;
  if (name) {
    res.send(`Hello ${name}`);
  } else {
    res.send("Express + TypeScript Server Pepe");
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
