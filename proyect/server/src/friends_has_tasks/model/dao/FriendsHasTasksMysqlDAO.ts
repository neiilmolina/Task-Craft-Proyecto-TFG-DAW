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
          aht.${FIELDS.idFriendHasTasks} AS idFriendHasTask,
          aht.${FIELDS.friendHasTaskRequestState} AS friendHasTaskRequestState,
  
          creador.idUsuario AS idUserCreator,
          creador.nombreUsuario AS userNameCreator,
          creador.email AS emailCreator,
          creador.urlImagen AS urlImgCreator,
  
          asignado.idUsuario AS idUserAssigned,
          asignado.nombreUsuario AS userNameAssigned,
          asignado.email AS emailAssigned,
          asignado.urlImagen AS urlImgAssigned,
  
          t.idTarea AS idTask,
          t.titulo AS title,
          t.descripcion AS description,
          t.fechaActividad AS activityDate,
  
          e.idEstado AS idState,
          e.estado AS state,
  
          ty.idTipo AS idType,
          ty.tipo AS type,
          ty.color AS color
  
        FROM ${TABLE_NAME} aht
        INNER JOIN tareas t ON aht.idTarea = t.idTarea
        INNER JOIN usuarios creador ON t.idUsuario = creador.idUsuario
        INNER JOIN usuarios asignado ON aht.idAmigo = asignado.idUsuario
        INNER JOIN estados e ON t.idEstado = e.idEstado
        INNER JOIN tipos ty ON t.idTipo = ty.idTipo
        WHERE 1 = 1
      `;

      const params: any[] = [];

      if (
        filters.idCreatorUser &&
        filters.idAssignedUser &&
        filters.idCreatorUser === filters.idAssignedUser
      ) {
        query += ` AND (t.idUsuario = ? OR aht.idAmigo = ?)`;
        params.push(filters.idCreatorUser, filters.idAssignedUser);
      } else {
        if (filters.idCreatorUser) {
          query += `t.idUsuario = ?`;
          params.push(filters.idCreatorUser);
        }

        if (filters.idAssignedUser) {
          query += `aht.idAmigo = ?`;
          params.push(filters.idAssignedUser);
        }
      }

      if (typeof filters.friendHasTaskRequestState === "boolean") {
        query += `aht.${FIELDS.friendHasTaskRequestState} = ?`;
        params.push(filters.friendHasTaskRequestState);
      }

      connection.query(query, params, (err, results: RowDataPacket[]) => {
        if (err) return reject(err);
        if (!Array.isArray(results)) {
          return reject(
            new Error("Expected array of results but got something else.")
          );
        }
        let data: FriendHasTasks[];

        try {
          data = results.map((row) => ({
            idFriendHasTasks: row.idFriendHasTask,
            friendHasTaskRequestState: row.friendHasTaskRequestState,
            creatorUser: {
              idUser: row.idUserCreator,
              userName: row.userNameCreator,
              email: row.emailCreator,
              urlImg: row.urlImgCreator,
            },
            assignedUser: {
              idUser: row.idUserAssigned,
              userName: row.userNameAssigned,
              email: row.emailAssigned,
              urlImg: row.urlImgAssigned,
            },
            task: buildTaskFromFields({
              idTask: row.idTask,
              title: row.title,
              description: row.description,
              activityDate: row.activityDate,
              idState: row.idState,
              state: row.state,
              idType: row.idType,
              type: row.type,
              color: row.color,
              idUser: row.idUserCreator,
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
          aht.${FIELDS.idFriendHasTasks} AS idFriendHasTask,
          aht.${FIELDS.friendHasTaskRequestState} AS friendHasTaskRequestState,
  
          creador.idUsuario AS idUserCreator,
          creador.nombreUsuario AS userNameCreator,
          creador.email AS emailCreator,
          creador.urlImagen AS urlImgCreator,
  
          asignado.idUsuario AS idUserAssigned,
          asignado.nombreUsuario AS userNameAssigned,
          asignado.email AS emailAssigned,
          asignado.urlImagen AS urlImgAssigned,
  
          t.idTarea AS idTask,
          t.titulo AS title,
          t.descripcion AS description,
          t.fechaActividad AS activityDate,
  
          e.idEstado AS idState,
          e.estado AS state,
  
          ty.idTipo AS idType,
          ty.tipo AS type,
          ty.color AS color
  
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
            idFriendHasTasks: row.idFriendHasTask,
            friendHasTaskRequestState: row.friendHasTaskRequestState,
            creatorUser: {
              idUser: row.idUserCreator,
              userName: row.userNameCreator,
              email: row.emailCreator,
              urlImg: row.urlImgCreator,
            },
            assignedUser: {
              idUser: row.idUserAssigned,
              userName: row.userNameAssigned,
              email: row.emailAssigned,
              urlImg: row.urlImgAssigned,
            },
            task: buildTaskFromFields({
              idTask: row.idTask,
              title: row.title,
              description: row.description,
              activityDate: row.activityDate,
              idState: row.idState,
              state: row.state,
              idType: row.idType,
              type: row.type,
              color: row.color,
              idUser: row.idUserCreator,
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
