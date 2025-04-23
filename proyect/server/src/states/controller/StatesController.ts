// src/estados/EstadosController.ts
import { RequestHandler } from "express";
import { validateStateNoId } from "task-craft-models";
import StatesRepository from "@/src/states/model/StatesRepository";
import { StateNoId } from "task-craft-models";
import IStatesDAO from "@/src/states/model/dao/IStatesDAO";

export default class StatesController {
  private statesModel: StatesRepository;
  constructor(statesDAO: IStatesDAO) {
    this.statesModel = new StatesRepository(statesDAO);
  }

  // Define methods as RequestHandler types
  getStates: RequestHandler = async (req, res) => {
    try {
      const states = await this.statesModel.getAll();
      res.status(200).json(states);
    } catch (e) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  getStateById: RequestHandler = async (req, res) => {
    try {
      const idState = parseInt(req.params.idState);
      const state = await this.statesModel.getById(idState);

      if (state) {
        res.status(200).json(state);
      } else {
        res.status(404).json({ message: "Estado no encontrado" });
      }
    } catch (error) {
      console.error("Error al cargar el estado:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  createState: RequestHandler = async (req, res) => {
    try {
      const { state } = req.body;

      const result = validateStateNoId({ state });
      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      const newStateNoId: StateNoId = { state };
      const newState = await this.statesModel.create(newStateNoId);

      res.status(201).json(newState);
    } catch (error) {
      console.error("Error al crear el estado:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  updateState: RequestHandler = async (req, res) => {
    try {
      const idState = parseInt(req.params.idState);
      const { state } = req.body;

      const result = validateStateNoId({ state });
      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      const datosActualizados: StateNoId = { state };
      const updatedEstado = await this.statesModel.update(
        idState,
        datosActualizados
      );

      if (updatedEstado) {
        res.status(200).json(updatedEstado);
      } else {
        res.status(404).json({ message: "Estado no encontrado" });
      }
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  deleteState: RequestHandler = async (req, res) => {
    try {
      const idState = parseInt(req.params.idState);
      const result = await this.statesModel.delete(idState);

      if (result) {
        res.status(200).json({ message: "Estado eliminado correctamente" });
      } else {
        res.status(404).json({ message: "Estado no encontrado" });
      }
    } catch (error) {
      console.error("Error al eliminar el estado:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}
