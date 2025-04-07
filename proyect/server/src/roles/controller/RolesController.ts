import { RequestHandler } from "express";
import RolesRepository from "@/src/roles/model/RolesRepository";
import { validateRoleNoId } from "@/src/roles/model/interfaces/schemasRoles";
import { RoleNoId } from "@/src/roles/model/interfaces/interfacesRoles";
import IRolesDAO from "@/src/roles/model/dao/IRolesDAO";

export default class RolesController {
  private rolesRepository: RolesRepository;

  constructor(rolesDAO: IRolesDAO) {
    this.rolesRepository = new RolesRepository(rolesDAO);
  }

  // Método para obtener todos los roles
  getRoles: RequestHandler = async (req, res) => {
    try {
      // Obtiene todos los roles utilizando el modelo
      const roles = await this.rolesRepository.getAll();

      // Devuelve los roles con un status 200
      res.status(200).json(roles);
    } catch (error) {
      // Maneja errores internos del servidor
      console.error("Error al cargar los roles:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  // Obtener un rol por su ID
  getRoleById: RequestHandler = async (req, res) => {
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
      const rol = await this.rolesRepository.getById(idRol);

      if (rol) {
        res.status(200).json(rol);
        return;
      } else {
        res.status(404).json({ error: "Rol no encontrado" });
        return;
      }
    } catch (error) {
      console.error("Error al cargar el role:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
  };

  createRole: RequestHandler = async (req, res) => {
    try {
      const rolData: RoleNoId = {
        role: req.body.role || (req.query.rol as string),
      };

      // Validar la entrada con el esquema de validación
      const result = validateRoleNoId(rolData);
      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      // Crear el nuevo rol usando el modelo
      const newRol = await this.rolesRepository.create(rolData);

      if (!newRol) {
        res.status(500).json({ error: "No se pudo crear el rol" });
        return;
      }

      res.status(201).json(newRol);
    } catch (error: any) {
      console.error("Error al crear el role:", error);

      if (error.message && error.message.includes("already exists")) {
        res.status(400).json({ error: "El rol ya existe" });
        return;
      }

      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  updateRole: RequestHandler = async (req, res) => {
    try {
      // Validate the input data
      const rolData: RoleNoId = req.body;
      const validationResult = validateRoleNoId(rolData);

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
      const updatedRol = await this.rolesRepository.update(idRol, rolData);

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

  deleteRole: RequestHandler = async (req, res) => {
    try {
      const idRol = parseInt(req.params.idRol, 10);

      if (isNaN(idRol)) {
        res.status(400).json({ error: "ID inválido" });
        return;
      }

      const result = await this.rolesRepository.delete(idRol);

      if (result) {
        res.status(200).json({ message: "Rol eliminado correctamente" });
        return;
      } else {
        res.status(404).json({ error: "Rol no encontrado" });
        return;
      }
    } catch (error) {
      console.error("Error al eliminar el role:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
  };
}
