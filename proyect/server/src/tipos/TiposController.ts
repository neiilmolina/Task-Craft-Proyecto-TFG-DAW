import { RequestHandler } from "express";
import TiposModel from "./TiposModel";
import { TipoCreate } from "./interfacesTipos";
import { validateTipoCreate, validateTipoUpdate } from "./schemasTipos";

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
        return;
      } else {
        res.status(404).json({ message: "tipo no encontrado" });
        return;
      }
    } catch (error) {
      console.error("Error al cargar el tipo:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
  };

  createTipo: RequestHandler = async (req, res) => {
    try {
      const tipoData: TipoCreate = req.body;

      const result = validateTipoCreate(tipoData);
      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      const newTipo = await this.tiposModel.create(tipoData);

      // Verificar si newTipo es null
      if (!newTipo) {
        res.status(500).json({ error: "No se pudo crear el tipo" });
        return;
      }

      res.status(201).json(newTipo);
    } catch (error: any) {
      console.error("Error al crear el Tipo:", error);
      // Verificar si el error es que el tipo ya existe
      if (error.message && error.message.includes("already exists")) {
        res.status(400).json({ error: "El Tipo ya existe" });
        return;
      }

      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  updateTipo: RequestHandler = async (req, res) => {
    try {
      // Validación de la entrada
      const { success, error } = validateTipoUpdate(req.body);
      if (!success) {
        console.log("Validación fallida", error);
        res.status(400).json({ error });
        return;
      }
      console.log("Validación exitosa");

      const id = parseInt(req.params.id);

      // Llamada al modelo para actualizar el tipo
      const updatedTipo = await this.tiposModel.update(id, req.body);

      if (!updatedTipo) {
        res.status(404).json({ message: "Tipo no encontrado" });
        return;
      }

      console.log("Tipo actualizado con éxito");
      res.status(200).json(updatedTipo);
    } catch (error) {
      console.error("Error interno del servidor:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}
