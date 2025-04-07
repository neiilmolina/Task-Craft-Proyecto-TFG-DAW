import IStatesDAO from "@/src/states/model/dao/IStatesDAO";
import { State, StateNoId } from "../interfaces/interfacesStates";
import connection from "@/config/mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";
const TABLE_NAME = "estados";
const FIELDS = {
  idState: "idEstado",
  state: "estado",
};

export default class StatesMysqlDAO implements IStatesDAO {
  async getAll(): Promise<State[]> {
    return new Promise<State[]>((resolve, reject) => {
      const query = `SELECT * FROM ${TABLE_NAME}`;
      connection.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }
        if (Array.isArray(results)) {
          const state: State[] = results.map((row: any) => ({
            idState: row[FIELDS.idState],
            state: row[FIELDS.state],
          }));
          resolve(state);
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
      const query = `SELECT * FROM ${TABLE_NAME} WHERE ${FIELDS.idState} = ?`;
      connection.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (Array.isArray(results) && results.length > 0) {
          const row = results[0] as RowDataPacket;
          const state: State = {
            idState: row[FIELDS.idState],
            state: row[FIELDS.state],
          };
          resolve(state);
        } else {
          resolve(null);
        }
      });
    });
  }

  async create(state: StateNoId): Promise<State | null> {
    return new Promise<State>((resolve, reject) => {
      const query = `INSERT INTO ${TABLE_NAME} (${FIELDS.state}) VALUES (?)`;
      connection.query(query, [state.state], (err, results) => {
        if (err) {
          console.error(err);
          return reject(null);
        }
        const resultSet = results as ResultSetHeader;
        const newEstado: State = {
          idState: resultSet.insertId,
          state: state.state,
        };
        resolve(newEstado);
      });
    });
  }

  async update(id: number, state: StateNoId): Promise<State | null> {
    return new Promise<State>((resolve, reject) => {
      const query = `UPDATE ${TABLE_NAME} SET ${FIELDS.state} = ? WHERE ${FIELDS.idState} = ?`;
      connection.query(query, [state.state, id], (err, results) => {
        if (err) {
          console.error(err);
          return reject(null);
        }
        const resultSet = results as ResultSetHeader;
        if (resultSet.affectedRows === 0) {
          return reject(new Error("Estado not found"));
        }
        const updatedEstado: State = { idState: id, state: state.state };
        resolve(updatedEstado);
      });
    });
  }

  async delete(id: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const query = `DELETE FROM ${TABLE_NAME} WHERE ${FIELDS.idState} = ?`;
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
