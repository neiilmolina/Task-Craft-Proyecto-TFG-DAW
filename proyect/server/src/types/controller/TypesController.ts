import { RequestHandler } from "express";
import {
  TypeCreate,
  TypeUpdate,
} from "task-craft-models";
import {
  validateTypeCreate,
  validateTypeUpdate,
} from "task-craft-models";
import ITypesDAO from "@/src/types/model/dao/ITypesDAO";
import TypesRepository from "@/src/types/model/TypesRepository";
import { UUID_REGEX } from "@/src/core/constants";

export default class TypesController {
  private typesRepository: TypesRepository;
  constructor(typesDAO: ITypesDAO) {
    this.typesRepository = new TypesRepository(typesDAO);
  }

  getTypes: RequestHandler = async (req, res) => {
    try {
      const idUser = req.query.idUser
        ? (req.query.idUser as string)
        : undefined;
      if (idUser && !UUID_REGEX.test(idUser)) {
        res.status(400).json({ error: "El ID del user debe ser válido" });
        return;
      }

      // Pasar los parámetros a la función getAll
      const types = await this.typesRepository.getAll(idUser);

      res.status(200).json(types);
      return;
    } catch (e) {
      console.error("Error al cargar los tipos:", e);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  getTypeById: RequestHandler = async (req, res) => {
    try {
      const idTypes = parseInt(req.params.idType);
      if (isNaN(idTypes)) {
        res.status(400).json({ error: "idType debe ser un número válido" });
        return;
      }
      const type = await this.typesRepository.getById(idTypes);

      if (type) {
        res.status(200).json(type);
        return;
      } else {
        res.status(404).json({ error: "tipo no encontrado" });
        return;
      }
    } catch (error) {
      console.error("Error al cargar el type:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
  };

  createType: RequestHandler = async (req, res) => {
    try {
      const typeData: TypeCreate = {
        type: req.body.type || (req.query.type as string),
        idUser: req.body.idUser || (req.query.idUser as string),
        color: decodeURIComponent(
          req.body.color || (req.query.color as string)
        ),
      };

      const result = validateTypeCreate(typeData);
      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      const newType = await this.typesRepository.create(typeData);

      if (!newType) {
        res.status(500).json({ error: "No se pudo crear el tipo" });
        return;
      }

      res.status(201).json(newType);
    } catch (error: any) {
      console.error("Error al crear el type:", error);

      if (error.message && error.message.includes("already exists")) {
        res.status(400).json({ error: "El Tipo ya existe" });
        return;
      }

      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  updateType: RequestHandler = async (req, res) => {
    try {
      const typeData: TypeUpdate = req.body;

      const { success, error } = validateTypeUpdate(typeData);
      if (!success) {
        res.status(400).json({ error });
        return;
      }

      // Obtener el ID desde los parámetros
      const id = parseInt(req.params.idType, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: "idTypes debe ser un número válido" });
        return;
      }

      // Llamada al modelo para actualizar el tipo
      const updateType = await this.typesRepository.update(id, typeData);

      if (!updateType) {
        res.status(404).json({ error: "Tipo no encontrado" });
        return;
      }

      res.status(200).json(updateType);
      return;
    } catch (error) {
      console.error("Error interno del servidor:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
  };

  deleteType: RequestHandler = async (req, res) => {
    try {
      const id = parseInt(req.params.idType); // Asegurar que use "idTypes" si ese es el parámetro correcto

      if (isNaN(id)) {
        // Validar si el ID no es un número válido
        res.status(400).json({ message: "ID inválido" });
        return;
      }

      const result = await this.typesRepository.delete(id);

      if (result) {
        res.status(200).json({ message: "Tipo eliminado correctamente" });
        return;
      } else {
        res.status(404).json({ error: "Tipo no encontrado" });
        return;
      }
    } catch (error) {
      console.error("Error al eliminar el type:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
  };
}
