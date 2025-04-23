import { Role, RoleNoId } from "task-craft-models";
import connection from "@/config/mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import IRolesDAO from "./IRolesDAO";

const TABLE_NAME = "roles"; // Nombre de la tabla
const FIELDS = {
  idRole: "idRol", // Mapeo del campo id
  role: "rol", // Mapeo del campo rol
};

export default class RolesMysqlDAO implements IRolesDAO {
  // Get all roles
  async getAll(): Promise<Role[]> {
    return new Promise<Role[]>((resolve, reject) => {
      const query = `SELECT * FROM ${TABLE_NAME}`;
      connection.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }

        // Asegurarse de que results sea un array
        if (Array.isArray(results)) {
          const roles: Role[] = results.map((row: any) => ({
            idRole: row[FIELDS.idRole],
            role: row[FIELDS.role],
          }));
          resolve(roles);
        } else {
          reject(
            new Error("Expected array of results but got something else.")
          );
        }
      });
    });
  }

  // Get a role by ID
  async getById(id: number): Promise<Role | null> {
    return new Promise<Role | null>((resolve, reject) => {
      const query = `SELECT * FROM ${TABLE_NAME} WHERE ${FIELDS.idRole} = ?`;
      connection.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }

        // Asegurarse de que results sea un array de RowDataPacket
        if (Array.isArray(results) && results.length > 0) {
          const row = results[0] as RowDataPacket; // Aseguramos que results[0] sea del tipo correcto

          const role: Role = {
            idRole: row[FIELDS.idRole], // Acceder a las propiedades de RowDataPacket
            role: row[FIELDS.role],
          };
          resolve(role);
        } else {
          resolve(null); // Si no se encuentra el rol, devolvemos null
        }
      });
    });
  }

  // Create a new role
  async create(role: RoleNoId): Promise<Role | null> {
    return new Promise<Role>((resolve, reject) => {
      const query = `INSERT INTO ${TABLE_NAME} (${FIELDS.role}) VALUES (?)`;
      connection.query(query, [role.role], (err, results) => {
        if (err) {
          console.error(err);
          return reject(null);
        }

        // Asegurarse de que results sea del tipo ResultSetHeader
        const resultSet = results as ResultSetHeader;

        // Crear el rol con el insertId del ResultSetHeader
        const newRole: Role = { idRole: resultSet.insertId, role: role.role };
        resolve(newRole);
      });
    });
  }

  // Update a role
  async update(id: number, role: RoleNoId): Promise<Role | null> {
    return new Promise<Role>((resolve, reject) => {
      const query = `UPDATE ${TABLE_NAME} SET ${FIELDS.role} = ? WHERE ${FIELDS.idRole} = ?`;
      connection.query(query, [role.role, id], (err, results) => {
        if (err) {
          console.error(err);
          return reject(null);
        }

        // Asegurarse de que results sea del tipo ResultSetHeader
        const resultSet = results as ResultSetHeader;

        // Verificar si se actualizaron filas
        if (resultSet.affectedRows === 0) {
          return reject(new Error("Role not found"));
        }

        const updatedRole: Role = { idRole: id, role: role.role };
        resolve(updatedRole);
      });
    });
  }

  // Delete a role
  async delete(id: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const query = `DELETE FROM ${TABLE_NAME} WHERE ${FIELDS.idRole} = ?`;
      connection.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }

        // Asegurarse de que results sea del tipo ResultSetHeader
        const resultSet = results as ResultSetHeader;

        // Verificar si se eliminaron filas
        if (resultSet.affectedRows === 0) {
          return reject(new Error("Role not found"));
        }

        resolve(true);
      });
    });
  }
}
