import connection from "@/config/mysql";
import {
  Diary,
  DiaryCreate,
  DiaryUpdate,
  DiaryReturn,
  DiaryFilters,
} from "task-craft-models";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Temporal } from "@js-temporal/polyfill";
import IDiariesDAO from "@/src/diaries/model/dao/IDiariesDAO";
import { formatDate } from "@/src/core/formatDate";

const TABLE_NAME = "diarios";
const FIELDS = {
  idDiary: "idDiario",
  title: "titulo",
  description: "descripcion",
  activityDate: "fechaActividad",
  idUser: "idUsuario",
};

export default class DiariesMysqlDAO implements IDiariesDAO {
  async getAll(diaryFilters?: DiaryFilters): Promise<Diary[]> {
    return new Promise<Diary[]>((resolve, reject) => {
      const { idUser, futureDate, pastDate, title } = diaryFilters || {};

      let query = `
          SELECT 
            d.${FIELDS.idDiary}, 
            d.${FIELDS.title}, 
            d.${FIELDS.description}, 
            d.${FIELDS.activityDate},
            d.${FIELDS.idUser} AS idUsuario
          FROM ${TABLE_NAME} d
          WHERE 1=1
        `;

      const params: any[] = [];

      if (idUser) {
        query += `AND d.${FIELDS.idUser} = ?`;
        params.push(idUser);
      }

      if (title) {
        query += ` AND d.${FIELDS.title} LIKE ?`;
        params.push(`%${title}%`);
      }

      if (futureDate && pastDate) {
        query += ` AND d.${FIELDS.activityDate} BETWEEN ? AND ?`;
        params.push(pastDate.replace("T", " "), futureDate.replace("T", " "));
      } else {
        if (pastDate) {
          query += ` AND d.${FIELDS.activityDate} BETWEEN ? AND CURDATE()`;
          params.push(pastDate.replace("T", " "));
        }
        if (futureDate) {
          query += ` AND d.${FIELDS.activityDate} BETWEEN CURDATE() AND ?`;
          params.push(futureDate.replace("T", " "));
        }
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

        const diaries: Diary[] = results.map((row: RowDataPacket, i) => {
          try {
            return {
              idDiary: row[FIELDS.idDiary],
              title: row[FIELDS.title],
              description: row[FIELDS.description],
              activityDate: formatDate(row[FIELDS.activityDate]),
              idUser: row[FIELDS.idUser],
            };
          } catch (err) {
            throw err;
          }
        });

        resolve(diaries);
      });
    });
  }

  async getById(idDiary: string): Promise<Diary | null> {
    return new Promise<Diary | null>((resolve, reject) => {
      const query = `
        SELECT 
          d.${FIELDS.idDiary}, 
          d.${FIELDS.title}, 
          d.${FIELDS.description}, 
          d.${FIELDS.activityDate}, 
          d.${FIELDS.idUser} AS idUsuario
        FROM ${TABLE_NAME} d
        WHERE d.${FIELDS.idDiary} = ?`;

      connection.query(
        query,
        [idDiary],
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

            const diary: Diary = {
              idDiary: row[FIELDS.idDiary],
              title: row[FIELDS.title],
              description: row[FIELDS.description],
              activityDate: formatDate(row[FIELDS.activityDate]),
              idUser: row[FIELDS.idUser],
            };
            resolve(diary);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  async create(
    idDiary: string,
    diary: DiaryCreate
  ): Promise<DiaryReturn | null> {
    return new Promise<DiaryReturn | null>((resolve, reject) => {
      const query = `
          INSERT INTO ${TABLE_NAME}
            (${FIELDS.idDiary}, ${FIELDS.title}, ${FIELDS.description}, ${FIELDS.activityDate}, ${FIELDS.idUser})
          VALUES (?, ?, ?, ?, ?)
        `;

      // Convertir la fecha del formato string a un formato compatible con la base de datos (replace "T" por espacio)
      const formattedDate = diary.activityDate.replace("T", " ");

      const values = [
        idDiary,
        diary.title,
        diary.description,
        formattedDate,
        diary.idUser,
      ];

      // Ejecutar la consulta de inserción
      connection.query(query, values, (err: any, results: any) => {
        if (err) {
          return reject(new Error("Database insertion error")); // Lanza un error específico
        }

        // Convertir la fecha a Temporal.PlainDateTime para la respuesta
        const activityDate = Temporal.PlainDateTime.from(
          diary.activityDate.replace("T", "T")
        );

        resolve({
          idDiary: idDiary,
          title: diary.title,
          description: diary.description,
          activityDate: activityDate,
          idUser: diary.idUser,
        });
      });
    });
  }

  async update(
    idDiary: string,
    diary: DiaryUpdate
  ): Promise<DiaryReturn | null> {
    return new Promise<DiaryReturn>((resolve, reject) => {
      const query = `UPDATE ${TABLE_NAME} SET
                        ${FIELDS.title} = ?, 
                        ${FIELDS.description} = ?, 
                        ${FIELDS.activityDate} = ?, 
                        ${FIELDS.idUser} = ? 
                        WHERE ${FIELDS.idDiary} = ?`;

      connection.query(
        query,
        [
          diary.title,
          diary.description,
          diary.activityDate ? diary.activityDate.replace("T", " ") : undefined,
          diary.idUser,
          idDiary,
        ],
        (err: any, results: any) => {
          if (err) {
            return reject(new Error(`Database update error: ${err.message}`)); // Lanza un error con mensaje detallado
          }

          const resultSet = results as ResultSetHeader;

          if (resultSet.affectedRows === 0) {
            return reject(new Error("Diary not found"));
          }

          // Resolver con el resultado
          resolve({
            idDiary: idDiary,
            title: diary.title,
            description: diary.description,
            activityDate: diary.activityDate
              ? Temporal.PlainDateTime.from(diary.activityDate)
              : undefined,
            idUser: diary.idUser,
          } as DiaryReturn);
        }
      );
    });
  }

  async delete(idDiary: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const query = `DELETE FROM ${TABLE_NAME} WHERE ${FIELDS.idDiary} = ?`;
      connection.query(query, [idDiary], (err: any, results: any) => {
        if (err) {
          return reject(err);
        }
        const resultSet = results as ResultSetHeader;
        if (resultSet.affectedRows === 0) {
          return reject(new Error("Diary not found"));
        }
        resolve(true);
      });
    });
  }
}
