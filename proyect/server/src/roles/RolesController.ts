import { RequestHandler } from "express";
import RolesModel from "@/src/roles/RolesModel";
import { validateRol, validateRolNoId } from "@/src/roles/schemasRoles";
import { RolNoId } from "./interfacesRoles";

export default class RolesController {
  constructor(private rolesModel: RolesModel) {}

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
        nombre: req.body.nombre || (req.query.nombre as string),
        descripcion: req.body.descripcion || (req.query.descripcion as string),
      };

      // Validar la entrada con el esquema de validación
      const result = validateRolCreate(rolData);
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
}
