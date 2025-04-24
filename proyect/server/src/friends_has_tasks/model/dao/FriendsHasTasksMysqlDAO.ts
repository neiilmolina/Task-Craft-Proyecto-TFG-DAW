import connection from "@/config/mysql";
import IFriendHasTasksDAO from "@/src/friends_has_tasks/model/dao/IFriendsHasTasksDAO";
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
  getAll(filters: FriendHasTasksFilters): Promise<FriendHasTasks[]> {
    throw new Error("Method not implemented.");
  }
  getById(idFriendHasTask: string): Promise<FriendHasTasks | null> {
    throw new Error("Method not implemented.");
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
