import ITypesDAO from "@/src/types/model/dao/ITypesDAO";
import {
  Type,
  TypeCreate,
  TypeUpdate,
} from "@/src/types/model/interfaces/interfacesTypes";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import connection from "@/config/mysql";

// Constantes para los nombres de la tabla y los campos
const TABLE_NAME = "tipos";
const FIELDS = {
  idType: "idTipo",
  type: "tipo",
  color: "color",
  idUser: "idUsuario",
};

export default class TypesMysqlDAO implements ITypesDAO {
  getAll(idUser?: string): Promise<Type[] | null> {
    return new Promise<Type[]>((resolve, reject) => {
      let query = `SELECT * FROM ${TABLE_NAME}`;
      const params: any[] = [];

      if (idUser) {
        query += ` WHERE ${FIELDS.idUser} = ?`;
        params.push(idUser);
      }

      connection.query(query, params, (err: any, results: RowDataPacket[]) => {
        if (err) {
          return reject(err);
        }

        if (!Array.isArray(results)) {
          return reject(
            new Error("Expected array of results but got something else.")
          );
        }

        const types: Type[] = results.map((row) => ({
          idType: row[FIELDS.idType],
          type: row[FIELDS.type],
          color: row[FIELDS.color],
          idUser: row[FIELDS.idUser],
        }));

        resolve(types);
      });
    });
  }
  getById(idType: number): Promise<Type | null> {
    return new Promise<Type | null>((resolve, reject) => {
      const query = `SELECT * FROM ${TABLE_NAME} WHERE ${FIELDS.idType} = ?`;

      connection.query(
        query,
        [idType],
        (err: any, results: RowDataPacket[]) => {
          if (err) {
            return reject(err);
          }

          if (!Array.isArray(results)) {
            return reject(
              new Error("Expected array of results but got something else.")
            );
          }

          if (results.length > 0) {
            const row = results[0];
            const type: Type = {
              idType: row[FIELDS.idType],
              type: row[FIELDS.type],
              color: row[FIELDS.color],
              idUser: row[FIELDS.idUser],
            };
            resolve(type);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  create(type: TypeCreate): Promise<Type | null> {
    return new Promise<Type>((resolve, reject) => {
      const query = `INSERT INTO ${TABLE_NAME} (${FIELDS.type}, ${FIELDS.color}, ${FIELDS.idUser}) VALUES (?, ?, ?)`;
      connection.query(
        query,
        [type.type, type.color, type.idUser],
        (err: any, results: ResultSetHeader) => {
          if (err) {
            return reject(new Error("Database insertion error")); // Lanza un error específico
          }
          const newType: Type = {
            idType: results.insertId,
            type: type.type,
            color: type.color,
            idUser: type.idUser,
          };
          resolve(newType);
        }
      );
    });
  }
  update(idType: number, type: TypeUpdate): Promise<Type | null> {
    return new Promise<Type>((resolve, reject) => {
      const updates: string[] = [];
      const values: any[] = [];

      // Construimos dinámicamente el SET
      if (type.type !== undefined) {
        updates.push(`${FIELDS.type} = ?`);
        values.push(type.type);
      }

      if (type.color !== undefined) {
        updates.push(`${FIELDS.color} = ?`);
        values.push(type.color);
      }

      if (type.idUser !== undefined) {
        updates.push(`${FIELDS.idUser} = ?`);
        values.push(type.idUser);
      }

      if (updates.length === 0) {
        return reject(new Error("No se proporcionaron campos para actualizar"));
      }

      const query = `UPDATE ${TABLE_NAME} SET ${updates.join(", ")} WHERE ${
        FIELDS.idType
      } = ?`;
      values.push(idType); // Añadimos el id al final

      connection.query(query, values, (err: any, results: any) => {
        if (err) {
          return reject(new Error(`Database update error: ${err.message}`));
        }

        const resultSet = results as ResultSetHeader;

        if (resultSet.affectedRows === 0) {
          return reject(new Error("Type not found"));
        }

        // Retornamos el objeto con lo que se actualizó
        resolve({
          idType,
          type: type.type ?? "",
          color: type.color ?? "",
          idUser: type.idUser ?? "", // Si no se pasó, será `undefined`
        });
      });
    });
  }

  delete(idType: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const query = `DELETE FROM ${TABLE_NAME} WHERE ${FIELDS.idType} = ?`;
      connection.query(query, [idType], (err: any, results: any) => {
        if (err) {
          return reject(err);
        }
        const resultSet = results as ResultSetHeader;
        if (resultSet.affectedRows === 0) {
          return reject(new Error("Tipo no encontrado"));
        }
        resolve(true);
      });
    });
  }
}
