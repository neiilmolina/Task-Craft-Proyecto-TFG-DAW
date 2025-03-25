import { Rol, RolNoId } from "@/src/roles/interfacesRoles";
import connection from "@/config/mysql"; // Asegúrate de que la ruta sea correcta
import IRolesDAO from "./IRolesDAO";
import { ResultSetHeader, RowDataPacket } from "mysql2";

const TABLE_NAME = "roles"; // Nombre de la tabla
const FIELDS = {
  idRol: "idRol", // Mapeo del campo id
  rol: "rol", // Mapeo del campo rol
};

export default class RolesMysqlDAO implements IRolesDAO {
  // Get all roles
  async getAll(): Promise<Rol[]> {
    return new Promise<Rol[]>((resolve, reject) => {
      const query = `SELECT * FROM ${TABLE_NAME}`;
      connection.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }

        // Asegurarse de que results sea un array
        if (Array.isArray(results)) {
          const roles: Rol[] = results.map((row: any) => ({
            idRol: row[FIELDS.idRol],
            rol: row[FIELDS.rol],
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
  async getById(id: number): Promise<Rol | null> {
    return new Promise<Rol | null>((resolve, reject) => {
      const query = `SELECT * FROM ${TABLE_NAME} WHERE ${FIELDS.idRol} = ?`;
      connection.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }

        // Asegurarse de que results sea un array de RowDataPacket
        if (Array.isArray(results) && results.length > 0) {
          const row = results[0] as RowDataPacket; // Aseguramos que results[0] sea del tipo correcto

          const rol: Rol = {
            idRol: row[FIELDS.idRol], // Acceder a las propiedades de RowDataPacket
            rol: row[FIELDS.rol],
          };
          resolve(rol);
        } else {
          resolve(null); // Si no se encuentra el rol, devolvemos null
        }
      });
    });
  }

  // Create a new role
  async create(role: RolNoId): Promise<Rol> {
    return new Promise<Rol>((resolve, reject) => {
      const query = `INSERT INTO ${TABLE_NAME} (${FIELDS.rol}) VALUES (?)`;
      connection.query(query, [role.rol], (err, results) => {
        if (err) {
          return reject(err);
        }

        // Asegurarse de que results sea del tipo ResultSetHeader
        const resultSet = results as ResultSetHeader;

        // Crear el rol con el insertId del ResultSetHeader
        const newRole: Rol = { idRol: resultSet.insertId, rol: role.rol };
        resolve(newRole);
      });
    });
  }

  // Update a role
  async update(id: number, role: RolNoId): Promise<Rol> {
    return new Promise<Rol>((resolve, reject) => {
      const query = `UPDATE ${TABLE_NAME} SET ${FIELDS.rol} = ? WHERE ${FIELDS.idRol} = ?`;
      connection.query(query, [role.rol, id], (err, results) => {
        if (err) {
          return reject(err);
        }

        // Asegurarse de que results sea del tipo ResultSetHeader
        const resultSet = results as ResultSetHeader;

        // Verificar si se actualizaron filas
        if (resultSet.affectedRows === 0) {
          return reject(new Error("Role not found"));
        }

        const updatedRole: Rol = { idRol: id, rol: role.rol };
        resolve(updatedRole);
      });
    });
  }

  // Delete a role
  async delete(id: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const query = `DELETE FROM ${TABLE_NAME} WHERE ${FIELDS.idRol} = ?`;
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
