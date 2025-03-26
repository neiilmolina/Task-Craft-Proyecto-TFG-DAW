import { RequestHandler } from "express";
import RolesModel from "@/src/roles/RolesModel";
import { validateRolNoId } from "@/src/roles/schemasRoles";
import { RolNoId } from "./interfacesRoles";
import IRolesDAO from "./dao/IRolesDAO";

export default class RolesController {
  private rolesModel: RolesModel;

  constructor(rolesDAO: IRolesDAO) {
    this.rolesModel = new RolesModel(rolesDAO);
  }

  // Método para obtener todos los roles
  getRoles: RequestHandler = async (req, res) => {
    try {
      // Obtiene todos los roles utilizando el modelo
      const roles = await this.rolesModel.getAll();

      // Devuelve los roles con un status 200
      res.status(200).json(roles);
    } catch (error) {
      // Maneja errores internos del servidor
      console.error("Error al cargar los roles:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  // Obtener un rol por su ID
  getRolById: RequestHandler = async (req, res) => {
    try {
      const idRol = parseInt(req.params.idRol);

      // Verifica si el ID es válido
      if (isNaN(idRol)) {
        res
          .status(400)
          .json({ error: "El ID del rol debe ser un número válido" });
        return;
      }

      // Llama al modelo para obtener el rol por ID
      const rol = await this.rolesModel.getById(idRol);

      if (rol) {
        res.status(200).json(rol);
        return;
      } else {
        res.status(404).json({ error: "Rol no encontrado" });
        return;
      }
    } catch (error) {
      console.error("Error al cargar el rol:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
  };

  createRol: RequestHandler = async (req, res) => {
    try {
      const rolData: RolNoId = {
        rol: req.body.rol || (req.query.rol as string),
      };

      // Validar la entrada con el esquema de validación
      const result = validateRolNoId(rolData);
      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      // Crear el nuevo rol usando el modelo
      const newRol = await this.rolesModel.create(rolData);

      if (!newRol) {
        res.status(500).json({ error: "No se pudo crear el rol" });
        return;
      }

      res.status(201).json(newRol);
    } catch (error: any) {
      console.error("Error al crear el rol:", error);

      if (error.message && error.message.includes("already exists")) {
        res.status(400).json({ error: "El rol ya existe" });
        return;
      }

      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  updateRol: RequestHandler = async (req, res) => {
    try {
      // Validate the input data
      const rolData: RolNoId = req.body;
      const validationResult = validateRolNoId(rolData);

      if (!validationResult.success) {
        res.status(400).json({ error: validationResult.error });
        return;
      }

      // Validate the role ID
      const idRol = parseInt(req.params.idRol, 10);
      if (isNaN(idRol)) {
        res.status(400).json({ error: "Invalid role ID" });
        return;
      }

      // Attempt to update the role
      const updatedRol = await this.rolesModel.update(idRol, rolData);

      if (!updatedRol) {
        res.status(404).json({ error: "Rol no encontrado" });
        return;
      }

      // Successfully updated
      res.status(200).json(updatedRol);
      return;
    } catch (error) {
      console.error("Error al actualizar el role:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
  };

  deleteRol: RequestHandler = async (req, res) => {
    try {
      const idRol = parseInt(req.params.idRol, 10);

      if (isNaN(idRol)) {
        res.status(400).json({ error: "ID inválido" });
        return;
      }

      const result = await this.rolesModel.delete(idRol);

      if (result) {
        res.status(200).json({ message: "Rol eliminado correctamente" });
        return;
      } else {
        res.status(404).json({ error: "Rol no encontrado" });
        return;
      }
    } catch (error) {
      console.error("Error al eliminar el rol:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
  };
}
