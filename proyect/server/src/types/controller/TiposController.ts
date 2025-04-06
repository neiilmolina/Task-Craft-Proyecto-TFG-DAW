import { RequestHandler } from "express";
import { TipoCreate } from "@/src/types/model/interfaces/interfacesTypes";
import {
  validateTipoCreate,
  validateTipoUpdate,
} from "@/src/types/model/interfaces/schemasTypes";
import ITiposDAO from "@/src/types/model/dao/ITiposDAO";
import TypesRepository from "@/src/types/model/TypesRepository";

export default class TiposController {
  private tiposModel: TypesRepository;
  constructor(tiposDAO: ITiposDAO) {
    this.tiposModel = new TypesRepository(tiposDAO);
  }

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

  getTipoById: RequestHandler = async (req, res) => {
    try {
      const idTipo = parseInt(req.params.idTipo);

      const userDetails = req.params.userDetails === "true";
      const tipo = await this.tiposModel.getById(idTipo, userDetails);

      if (tipo) {
        res.status(200).json(tipo);
        return;
      } else {
        res.status(404).json({ error: "tipo no encontrado" });
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
      const tipoData: TipoCreate = {
        tipo: req.body.tipo || (req.query.tipo as string),
        idUsuario: req.body.idUsuario || (req.query.idUsuario as string),
        color: decodeURIComponent(
          req.body.color || (req.query.color as string)
        ),
      };

      const result = validateTipoCreate(tipoData);
      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      const newTipo = await this.tiposModel.create(tipoData);

      if (!newTipo) {
        res.status(500).json({ error: "No se pudo crear el tipo" });
        return;
      }

      res.status(201).json(newTipo);
    } catch (error: any) {
      console.error("Error al crear el Tipo:", error);

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
        res.status(400).json({ error });
        return;
      }

      // Obtener el ID desde los parámetros
      const id = parseInt(req.params.idTipo, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: "idTipo debe ser un número válido" });
        return;
      }

      // Llamada al modelo para actualizar el tipo
      const updatedTipo = await this.tiposModel.update(id, req.body);

      if (!updatedTipo) {
        res.status(404).json({ error: "Tipo no encontrado" });
        return;
      }

      res.status(200).json(updatedTipo);
      return;
    } catch (error) {
      console.error("Error interno del servidor:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
  };

  deleteTipo: RequestHandler = async (req, res) => {
    try {
      const id = parseInt(req.params.idTipo); // Asegurar que use "idTipo" si ese es el parámetro correcto

      if (isNaN(id)) {
        // Validar si el ID no es un número válido
        res.status(400).json({ message: "ID inválido" });
        return;
      }

      const result = await this.tiposModel.delete(id);

      if (result) {
        res.status(200).json({ message: "Tipo eliminado correctamente" });
        return;
      } else {
        res.status(404).json({ error: "Tipo no encontrado" });
        return;
      }
    } catch (error) {
      console.error("Error al eliminar el tipo:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
  };
}
