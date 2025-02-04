import "dotenv/config";
import createEstadosRoute from "@/src/estados/routes";
import express, { json } from "express";
import dotenv from "dotenv";

dotenv.config();

const createApp = (estadosModel: any) => {
    const app = express();
    app.use(json());
    app.disable("x-powered-by");

    app.use("/estados", createEstadosRoute(estadosModel));
};

export default createApp;