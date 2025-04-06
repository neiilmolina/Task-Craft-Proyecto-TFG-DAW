import IEstadosDAO from "@/src/states/dao/IStatesDAO";
import { State, StateNoId } from "../interfacesStates";
import connection from "@/config/mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";
const TABLE_NAME = "estados";
const FIELDS = {
  idEstado: "idEstado",
  estado: "estado",
};

export default class EstadosMysqlDAO implements IEstadosDAO {
  async getAll(): Promise<State[]> {
    return new Promise<State[]>((resolve, reject) => {
      const query = `SELECT * FROM ${TABLE_NAME}`;
      connection.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }
        if (Array.isArray(results)) {
          const estados: State[] = results.map((row: any) => ({
            idEstado: row[FIELDS.idEstado],
            estado: row[FIELDS.estado],
          }));
          resolve(estados);
        } else {
          reject(
            new Error("Expected array of results but got something else.")
          );
        }
      });
    });
  }

  async getById(id: number): Promise<State | null> {
    return new Promise<State | null>((resolve, reject) => {
      const query = `SELECT * FROM ${TABLE_NAME} WHERE ${FIELDS.idEstado} = ?`;
      connection.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (Array.isArray(results) && results.length > 0) {
          const row = results[0] as RowDataPacket;
          const estado: State = {
            idEstado: row[FIELDS.idEstado],
            estado: row[FIELDS.estado],
          };
          resolve(estado);
        } else {
          resolve(null);
        }
      });
    });
  }

  async create(estado: StateNoId): Promise<State | null> {
    return new Promise<Estado>((resolve, reject) => {
      const query = `INSERT INTO ${TABLE_NAME} (${FIELDS.estado}) VALUES (?)`;
      connection.query(query, [estado.estado], (err, results) => {
        if (err) {
          console.error(err);
          return reject(null);
        }
        const resultSet = results as ResultSetHeader;
        const newEstado: Estado = {
          idEstado: resultSet.insertId,
          estado: estado.estado,
        };
        resolve(newEstado);
      });
    });
  }

  async update(id: number, estado: StateNoId): Promise<State | null> {
    return new Promise<Estado>((resolve, reject) => {
      const query = `UPDATE ${TABLE_NAME} SET ${FIELDS.estado} = ? WHERE ${FIELDS.idEstado} = ?`;
      connection.query(query, [estado.estado, id], (err, results) => {
        if (err) {
          console.error(err);
          return reject(null);
        }
        const resultSet = results as ResultSetHeader;
        if (resultSet.affectedRows === 0) {
          return reject(new Error("Estado not found"));
        }
        const updatedEstado: Estado = { idEstado: id, estado: estado.estado };
        resolve(updatedEstado);
      });
    });
  }

  async delete(id: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const query = `DELETE FROM ${TABLE_NAME} WHERE ${FIELDS.idEstado} = ?`;
      connection.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        const resultSet = results as ResultSetHeader;
        if (resultSet.affectedRows === 0) {
          return reject(new Error("Estado not found"));
        }
        resolve(true);
      });
    });
  }
}
