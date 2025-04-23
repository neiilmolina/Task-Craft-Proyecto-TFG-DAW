import connection from "@/config/mysql";
import {
  Task,
  TaskCreate,
  TaskUpdate,
  TaskReturn,
} from "task-craft-models";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import ITaskDAO from "@/src/tasks/model/dao/ITasksDAO";
import { Temporal } from "@js-temporal/polyfill";

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
          return reject(err);
        }

        if (!Array.isArray(results)) {
          return reject(
            new Error("Expected array of results but got something else.")
          );
        }

        const tasks: Task[] = results.map((row: RowDataPacket, i) => {
          try {
            const rawDate = row[FIELDS.activityDate];
            let dateFormatted;

            if (rawDate instanceof Date) {
              const isoString = rawDate.toISOString().replace("Z", "");
              dateFormatted = Temporal.PlainDateTime.from(isoString);
            } else if (typeof rawDate === "string") {
              dateFormatted = Temporal.PlainDateTime.from(
                rawDate.replace(" ", "T")
              );
            } else {
              throw new Error("❌ Tipo de fecha inesperado: " + typeof rawDate);
            }

            return {
              idTask: row[FIELDS.idTask],
              title: row[FIELDS.title],
              description: row[FIELDS.description],
              activityDate: dateFormatted,
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
          } catch (err) {
            throw err;
          }
        });

        resolve(tasks);
      });
    });
  }

  async getById(idTask: string): Promise<Task | null> {
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
      WHERE t.${FIELDS.idTask} = ?`;

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

            // Convierte la fecha a Temporal.PlainDateTime si está presente
            if (!row[FIELDS.activityDate]) {
              return reject(
                new Error("La fecha de actividad no está definida.")
              );
            }

            const activityDate = Temporal.PlainDateTime.from(
              typeof row[FIELDS.activityDate] === "string"
                ? row[FIELDS.activityDate]
                : row[FIELDS.activityDate].toISOString().slice(0, 19)
            );

            const task: Task = {
              idTask: row[FIELDS.idTask],
              title: row[FIELDS.title],
              description: row[FIELDS.description],
              activityDate: activityDate, // Asignamos la fecha procesada
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
    return new Promise<TaskReturn | null>((resolve, reject) => {
      const query = `
        INSERT INTO ${TABLE_NAME}
          (${FIELDS.idTask}, ${FIELDS.title}, ${FIELDS.description}, ${FIELDS.activityDate}, ${FIELDS.idState}, ${FIELDS.idType}, ${FIELDS.idUser})
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      // Convertir la fecha del formato string a un formato compatible con la base de datos (replace "T" por espacio)
      const formattedDate = task.activityDate.replace("T", " ");

      const values = [
        idTask,
        task.title,
        task.description,
        formattedDate, // Fecha convertida al formato adecuado para la base de datos
        task.idState,
        task.idType,
        task.idUser,
      ];

      // Ejecutar la consulta de inserción
      connection.query(query, values, (err: any, results: any) => {
        if (err) {
          return reject(new Error("Database insertion error")); // Lanza un error específico
        }

        // Convertir la fecha a Temporal.PlainDateTime para la respuesta
        const activityDate = Temporal.PlainDateTime.from(
          task.activityDate.replace("T", "T")
        );

        resolve({
          idTask: idTask,
          title: task.title,
          description: task.description,
          activityDate: activityDate, // Usar Temporal.PlainDateTime para el campo de fecha
          idState: task.idState,
          idType: task.idType,
          idUser: task.idUser,
        });
      });
    });
  }
  async update(idTask: string, task: TaskUpdate): Promise<TaskReturn | null> {
    return new Promise<TaskReturn>((resolve, reject) => {
      const query = `UPDATE ${TABLE_NAME} SET
                      ${FIELDS.title} = ?, 
                      ${FIELDS.description} = ?, 
                      ${FIELDS.activityDate} = ?, 
                      ${FIELDS.idState} = ?,
                      ${FIELDS.idType} = ?, 
                      ${FIELDS.idUser} = ? 
                      WHERE ${FIELDS.idTask} = ?`;

      connection.query(
        query,
        [
          task.title,
          task.description,
          task.activityDate ? task.activityDate.replace("T", " ") : undefined, // Reemplaza 'T' si se proporciona activityDate
          task.idState,
          task.idType,
          task.idUser,
          idTask,
        ],
        (err: any, results: any) => {
          if (err) {
            return reject(new Error(`Database update error: ${err.message}`)); // Lanza un error con mensaje detallado
          }

          const resultSet = results as ResultSetHeader;

          if (resultSet.affectedRows === 0) {
            return reject(new Error("Task not found"));
          }

          // Resolver con el resultado
          resolve({
            idTask: idTask,
            title: task.title,
            description: task.description,
            activityDate: task.activityDate
              ? Temporal.PlainDateTime.from(task.activityDate)
              : undefined, // Convierte a Temporal si se proporciona
            idState: task.idState,
            idType: task.idType,
            idUser: task.idUser,
          } as TaskReturn);
        }
      );
    });
  }

  async delete(idTask: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const query = `DELETE FROM ${TABLE_NAME} WHERE ${FIELDS.idTask} = ?`;
      connection.query(query, [idTask], (err: any, results: any) => {
        if (err) {
          return reject(err);
        }
        const resultSet = results as ResultSetHeader;
        if (resultSet.affectedRows === 0) {
          return reject(new Error("Tarea no encontrada"));
        }
        resolve(true);
      });
    });
  }
}
