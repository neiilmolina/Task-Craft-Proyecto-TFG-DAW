import connection from "@/config/mysql";
import {
  Task,
  TaskCreate,
  TaskUpdate,
} from "@/src/tasks/model/interfaces/interfacesTasks";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import ITaskDAO from "./ITasksDAO";
import { Temporal } from "@js-temporal/polyfill";
import { resolve } from "path";

const TABLE_NAME = "tareas";
const FIELDS = {
  idTask: "idTarea",
  title: "titulo",
  description: "descripcion",
  activityDate: "fechaActividad",
  idState: "idEstado",
  state: "estado",
  idType: "idTipo",
  type: "tipo",
  color: "color",
  idUser: "idUsuario",
};

export default class TaskMysqlDAO implements ITaskDAO {
  async getAll(idUser?: string): Promise<Task[]> {
    return new Promise<Task[]>((resolve, reject) => {
      let query = `
        SELECT 
          t.${FIELDS.idTask}, 
          t.${FIELDS.title}, 
          t.${FIELDS.description}, 
          t.${FIELDS.activityDate}, 
          e.idEstado AS idEstado, 
          e.estado AS estado, 
          ty.idTipo AS idTipo, 
          ty.tipo AS tipo, 
          ty.color AS color,
          u.${FIELDS.idUser} AS idUsuario
        FROM ${TABLE_NAME} t
        JOIN estados e ON t.${FIELDS.idState} = e.idEstado
        JOIN tipos ty ON t.${FIELDS.idType} = ty.idTipo
        JOIN usuarios u ON t.${FIELDS.idUser} = u.idUsuario
      `;

      const conditions: string[] = [];
      const params: any[] = [];

      if (idUser) {
        conditions.push(`t.${FIELDS.idUser} = ?`);
        params.push(idUser);
      }

      if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(" AND ");
      }

      connection.query(query, params, (err: any, results: RowDataPacket[]) => {
        if (err) {
          console.error("Error al obtener tareas:", err);
          return reject(err);
        }

        if (!Array.isArray(results)) {
          return reject(
            new Error("Expected array of results but got something else.")
          );
        }

        const tasks: Task[] = results.map((row: RowDataPacket) => ({
          idTask: row[FIELDS.idTask],
          title: row[FIELDS.title],
          description: row[FIELDS.description],
          activityDate: row[FIELDS.activityDate],
          state: {
            idState: row[FIELDS.idState],
            state: row[FIELDS.state],
          },
          type: {
            idType: row[FIELDS.idType],
            type: row[FIELDS.type],
            color: row[FIELDS.color],
          },
          idUser: row[FIELDS.idUser],
        }));

        resolve(tasks);
      });
    });
  }
  getById(idTask: string): Promise<Task | null> {
    return new Promise<Task | null>((resolve, reject) => {
      const query = `
      SELECT 
        t.${FIELDS.idTask}, 
        t.${FIELDS.title}, 
        t.${FIELDS.description}, 
        t.${FIELDS.activityDate}, 
        e.idEstado AS idEstado, 
        e.estado AS estado, 
        ty.idTipo AS idTipo, 
        ty.tipo AS tipo, 
        ty.color AS color,
        u.${FIELDS.idUser} AS idUsuario
      FROM ${TABLE_NAME} t
      JOIN estados e ON t.${FIELDS.idState} = e.idEstado
      JOIN tipos ty ON t.${FIELDS.idType} = ty.idTipo
      JOIN usuarios u ON t.${FIELDS.idUser} = u.idUsuario
      WHERE t.${FIELDS.idTask} = ?
    `;

      connection.query(
        query,
        [idTask],
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
            const task: Task = {
              idTask: row[FIELDS.idTask],
              title: row[FIELDS.title],
              description: row[FIELDS.description],
              activityDate: row[FIELDS.activityDate],
              state: {
                idState: row[FIELDS.idState],
                state: row[FIELDS.state],
              },
              type: {
                idType: row[FIELDS.idType],
                type: row[FIELDS.type],
                color: row[FIELDS.color],
              },
              idUser: row[FIELDS.idUser],
            };
            resolve(task);
          } else {
            resolve(null);
          }
        }
      );
    });
  }
  async create(idTask: string, task: TaskCreate): Promise<TaskReturn | null> {
    try {
      const query = `
        INSERT INTO ${TABLE_NAME}
          (${FIELDS.idTask}, ${FIELDS.title}, ${FIELDS.description}, ${FIELDS.activityDate}, ${FIELDS.idState}, ${FIELDS.idType}, ${FIELDS.idUser})
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        idTask,
        task.title,
        task.description,
        task.activityDate.toString().replace("T", " "), // Convertir Temporal.PlainDateTime a formato "YYYY-MM-DD HH:MM:SS"
        task.idState,
        task.idType,
        task.idUser,
      ];

      // Ejecutar la consulta de inserción
      connection.query(query, values, (err: any, results: any) => {
        if (err) {
          return reject(new Error("Database insertion error")); // Lanza un error específico
        }

        // resolve({
        //   idTask: idTask,
        //   title: task.title,
        //   description: task.description,
        //   activityDate: task.activityDate,
        //   state: {
        //     idState: task.idState,
        //     state: "", // Aquí deberías obtener el estado correspondiente si es necesario
        //   },
        //   type: {
        // });
      });
    } catch (error) {
      console.error("Error creating task:", error);
      throw new Error("Error creating task in the database");
    }
  }
  update(idTask: string, task: TaskUpdate): Promise<TaskReturn | null> {
    throw new Error("Method not implemented.");
  }
  delete(idTask: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
