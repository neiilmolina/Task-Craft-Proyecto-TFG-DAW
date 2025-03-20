import { RequestHandler } from "express";
import TiposModel from "./TiposModel";

export default class TiposController {
  constructor(private tiposModel: TiposModel) {}

  getTipos: RequestHandler = async (req, res) => {
    try {
      const idUsuario = req.params.idUsuario;
      const userDetails = req.params.userDetails === "true";

      // Pasar los parámetros a la función getAll
      const tipos = await this.tiposModel.getAll(idUsuario, userDetails);

      res.status(200).json(tipos);
      return;
    } catch (e) {
      console.error("Error al cargar los tipos:", e);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  getTiposById: RequestHandler = async (req, res) => {
    try {
      const idTipos = parseInt(req.params.idTipos);
      const userDetails = req.params.userDetails === "true";
      const tipo = await this.tiposModel.getById(idTipos, userDetails);

      if (tipo) {
        res.status(200).json(tipo);
      } else {
        res.status(404).json({ message: "tipo no encontrado" });
      }
    } catch (error) {
      console.error("Error al cargar el tipo:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}
