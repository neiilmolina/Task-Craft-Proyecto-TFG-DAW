// src/estados/EstadosController.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import { validateEstadoNoId } from "@/src/estados/schemasEstados";
import EstadosModel from "./EstadosModel";
import { EstadoNoId } from "./interfacesEstados";

export default class EstadosController {
  constructor(private estadosModel: EstadosModel) {}

  // Define methods as RequestHandler types
  getEstados: RequestHandler = async (req, res) => {
    try {
      const estados = await this.estadosModel.getAll();
      res.status(200).json(estados);
    } catch (e) {
      console.error("Error al cargar los estados:", e);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  getEstadoById: RequestHandler = async (req, res) => {
    try {
      const idEstado = parseInt(req.params.idEstado);
      const estado = await this.estadosModel.getById(idEstado);
      
      if (estado) {
        res.status(200).json(estado);
      } else {
        res.status(404).json({ message: "Estado no encontrado" });
      }
    } catch (error) {
      console.error("Error al cargar el estado:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  createEstado: RequestHandler = async (req, res) => {
    try {
      const { estado } = req.body;
      
      const result = validateEstadoNoId({ estado });
      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      const nuevoEstado: EstadoNoId = { estado };
      const newEstado = await this.estadosModel.create(nuevoEstado);
      
      res.status(201).json(newEstado);
    } catch (error) {
      console.error("Error al crear el estado:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  updateEstado: RequestHandler = async (req, res) => {
    try {
      const idEstado = parseInt(req.params.idEstado);
      const { estado } = req.body;
      
      const result = validateEstadoNoId({ estado });
      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      const datosActualizados: EstadoNoId = { estado };
      const updatedEstado = await this.estadosModel.update(idEstado, datosActualizados);
      
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

  deleteEstado: RequestHandler = async (req, res) => {
    try {
      const idEstado = parseInt(req.params.idEstado);
      const result = await this.estadosModel.delete(idEstado);
      
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
