import connection from "@/config/mysql";
import { buildTaskFromFields } from "@/src/core/buildTaskFromFields";
import IFriendHasTasksDAO from "@/src/friends_has_tasks/model/dao/IFriendsHasTasksDAO";
import { RowDataPacket } from "mysql2";
import {
  FriendHasTasksFilters,
  FriendHasTasks,
  FriendHasTasksCreate,
  FriendHasTasksReturn,
} from "task-craft-models";

const TABLE_NAME = "amigos_has_tareas";
const FIELDS = {
  idFriendHasTasks: "idTareaCompartida",
  idFriend: "idTarea",
  idTask: "idTarea",
  friendHasTaskRequestState: "solicitudTareaAceptada",
};

export default class FriendHasTasksMysqlDAO implements IFriendHasTasksDAO {
  async getAll(filters: FriendHasTasksFilters): Promise<FriendHasTasks[]> {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT 
          aht.${FIELDS.idFriendHasTasks} AS idFriendHasTasks,
          aht.${FIELDS.friendHasTaskRequestState} AS friendHasTaskRequestState,
  
          creador.idUsuario AS creatorUser_idUser,
          creador.nombreUsuario AS creatorUser_userName,
          creador.email AS creatorUser_email,
          creador.urlImagen AS creatorUser_urlImg,
  
          asignado.idUsuario AS secondUser_idUser,
          asignado.nombreUsuario AS secondUser_userName,
          asignado.email AS secondUser_email,
          asignado.urlImagen AS secondUser_urlImg,
  
          t.idTarea AS task_idTask,
          t.titulo AS task_title,
          t.descripcion AS task_description,
          t.fechaActividad AS task_activityDate,
  
          e.idEstado AS task_state_idState,
          e.estado AS task_state_state,
  
          ty.idTipo AS task_type_idType,
          ty.tipo AS task_type_type,
          ty.color AS task_type_color
  
        FROM ${TABLE_NAME} aht
        INNER JOIN tareas t ON aht.idTarea = t.idTarea
        INNER JOIN usuarios creador ON t.idUsuario = creador.idUsuario
        INNER JOIN usuarios asignado ON aht.idAmigo = asignado.idUsuario
        INNER JOIN estados e ON t.idEstado = e.idEstado
        INNER JOIN tipos ty ON t.idTipo = ty.idTipo
      `;

      const conditions: string[] = [];
      const params: any[] = [];

      if (filters.idCreatorUser) {
        conditions.push(`t.idUsuario = ?`);
        params.push(filters.idCreatorUser);
      }

      if (filters.idAssignedUser) {
        conditions.push(`aht.idAmigo = ?`);
        params.push(filters.idAssignedUser);
      }

      if (typeof filters.friendHasTaskRequestState === "boolean") {
        conditions.push(`aht.${FIELDS.friendHasTaskRequestState} = ?`);
        params.push(filters.friendHasTaskRequestState);
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      connection.query(query, params, (err, results: RowDataPacket[]) => {
        if (err) return reject(err);
        let data: FriendHasTasks[];

        try {
          data = results.map((row) => ({
            idFriendHasTasks: row.idFriendHasTasks,
            friendHasTaskRequestState: row.friendHasTaskRequestState,
            creatorUser: {
              idUser: row.creatorUser_idUser,
              userName: row.creatorUser_userName,
              email: row.creatorUser_email,
              urlImg: row.creatorUser_urlImg,
            },
            assignedUser: {
              idUser: row.secondUser_idUser,
              userName: row.secondUser_userName,
              email: row.secondUser_email,
              urlImg: row.secondUser_urlImg,
            },
            task: buildTaskFromFields({
              idTask: row.task_idTask,
              title: row.task_title,
              description: row.task_description,
              activityDate: row.task_activityDate,
              idState: row.task_state_idState,
              state: row.task_state_state,
              idType: row.task_type_idType,
              type: row.task_type_type,
              color: row.task_type_color,
              idUser: row.creatorUser_idUser,
            }),
          }));
        } catch (err) {
          return reject(err);
        }

        resolve(data);
      });
    });
  }
  getById(idFriendHasTask: string): Promise<FriendHasTasks | null> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          aht.${FIELDS.idFriendHasTasks} AS idFriendHasTasks,
          aht.${FIELDS.friendHasTaskRequestState} AS friendHasTaskRequestState,
  
          creador.idUsuario AS creatorUser_idUser,
          creador.nombreUsuario AS creatorUser_userName,
          creador.email AS creatorUser_email,
          creador.urlImagen AS creatorUser_urlImg,
  
          asignado.idUsuario AS secondUser_idUser,
          asignado.nombreUsuario AS secondUser_userName,
          asignado.email AS secondUser_email,
          asignado.urlImagen AS secondUser_urlImg,
  
          t.idTarea AS task_idTask,
          t.titulo AS task_title,
          t.descripcion AS task_description,
          t.fechaActividad AS task_activityDate,
  
          e.idEstado AS task_state_idState,
          e.estado AS task_state_state,
  
          ty.idTipo AS task_type_idType,
          ty.tipo AS task_type_type,
          ty.color AS task_type_color
  
        FROM ${TABLE_NAME} aht
        INNER JOIN tareas t ON aht.idTarea = t.idTarea
        INNER JOIN usuarios creador ON t.idUsuario = creador.idUsuario
        INNER JOIN usuarios asignado ON aht.idAmigo = asignado.idUsuario
        INNER JOIN estados e ON t.idEstado = e.idEstado
        INNER JOIN tipos ty ON t.idTipo = ty.idTipo
        WHERE aht.${FIELDS.idFriendHasTasks} = ?
        LIMIT 1
      `;

      connection.query(
        query,
        [idFriendHasTask],
        (err, results: RowDataPacket[]) => {
          if (err) return reject(err);
          if (results.length === 0) return resolve(null);

          const row = results[0];

          const data: FriendHasTasks = {
            idFriendHasTasks: row.idFriendHasTasks,
            friendHasTaskRequestState: row.friendHasTaskRequestState,
            creatorUser: {
              idUser: row.creatorUser_idUser,
              userName: row.creatorUser_userName,
              email: row.creatorUser_email,
              urlImg: row.creatorUser_urlImg,
            },
            assignedUser: {
              idUser: row.secondUser_idUser,
              userName: row.secondUser_userName,
              email: row.secondUser_email,
              urlImg: row.secondUser_urlImg,
            },
            task: buildTaskFromFields({
              idTask: row.task_idTask,
              title: row.task_title,
              description: row.task_description,
              activityDate: row.task_activityDate,
              idState: row.task_state_idState,
              state: row.task_state_state,
              idType: row.task_type_idType,
              type: row.task_type_type,
              color: row.task_type_color,
              idUser: row.creatorUser_idUser,
            }),
          };

          resolve(data);
        }
      );
    });
  }

  create(
    idFriendHasTasks: string,
    shareTaskReq: FriendHasTasksCreate
  ): Promise<FriendHasTasksReturn | null> {
    return new Promise((resolve, reject) => {
      // Definir la consulta de inserción con el idFriend proporcionado
      const query = `
          INSERT INTO ${TABLE_NAME} 
            (${FIELDS.idFriendHasTasks}, ${FIELDS.idFriend}, ${FIELDS.idTask}, ${FIELDS.friendHasTaskRequestState})
          VALUES 
            (?, ?, ?, ?)
        `;

      // Ejecutar la consulta con los datos de la solicitud de amistad
      connection.query(
        query,
        [
          idFriendHasTasks,
          shareTaskReq.idAssignedUser,
          shareTaskReq.idTask,
          shareTaskReq.friendHasTaskRequestState,
        ],
        (err: any, results: any) => {
          if (err) {
            return reject(err);
          }

          // Si la inserción es exitosa, devolvemos el objeto FriendReturn
          if (results.affectedRows > 0) {
            const friendReturn: FriendHasTasksReturn = {
              idFriendHasTasks: idFriendHasTasks,
              idAssignedUser: shareTaskReq.idAssignedUser,
              idTask: shareTaskReq.idTask,
              friendHasTaskRequestState: shareTaskReq.friendHasTaskRequestState,
            };
            resolve(friendReturn);
          } else {
            resolve(null);
          }
        }
      );
    });
  }
  update(idFriendHasTask: string): Promise<FriendHasTasksReturn | null> {
    return new Promise((resolve, reject) => {
      // Consulta SQL para actualizar solo el campo solicitudAmigoAceptada a true
      const query = `
          UPDATE ${TABLE_NAME} 
          SET ${FIELDS.friendHasTaskRequestState} = true
          WHERE ${FIELDS.idFriendHasTasks} = ?
        `;

      // Ejecutar la consulta
      connection.query(query, [idFriendHasTask], (err: any, results: any) => {
        if (err) {
          return reject(err);
        }

        // Si no se actualizó ninguna fila, devolvemos null
        if (results.affectedRows === 0) {
          return resolve(null);
        }

        // Devolver el objeto FriendReturn con la actualización
        const friendReturn: FriendHasTasksReturn = {
          idFriendHasTasks: idFriendHasTask,
          idTask: "",
          idAssignedUser: "",
          friendHasTaskRequestState: true,
        };

        resolve(friendReturn); // Devolver el objeto con la actualización
      });
    });
  }
  delete(idFriendHasTask: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Consulta SQL para eliminar un registro por idFriend
      const query = `
        DELETE FROM ${TABLE_NAME}
        WHERE ${FIELDS.idFriendHasTasks} = ?
      `;

      // Ejecutar la consulta
      connection.query(query, [idFriendHasTask], (err: any, results: any) => {
        if (err) {
          return reject(err);
        }

        // Si se eliminó alguna fila, devolvemos true, de lo contrario, false
        if (results.affectedRows > 0) {
          resolve(true);
        } else {
          return reject(new Error("Amistad no encontrada"));
        }
      });
    });
  }
}
