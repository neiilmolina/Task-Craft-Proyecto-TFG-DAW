import connection from "@/config/mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import IFriendsDAO from "@/src/friends/model/dao/IFriendsDAO";
import {
  Friend,
  FriendCreate,
  FriendFilters,
  FriendReturn,
} from "task-craft-models/src/model/friends/interfaces/interfacesFriends";
import { UserFriends } from "task-craft-models/src/model/users/interfaces/interfacesUsers";

const TABLE_NAME = "amigos";
const FIELDS = {
  idFriend: "idAmigo",
  idFirstUser: "idPrimerUsuario",
  idSecondUser: "idSegundoUsuario",
  idUser: "idUsuario",
  urlImage: "urlImagen",
  userName: "nombreUsuario",
  email: "email",
  friendRequestState: "solicitudAmigoAceptada",
};

export default class FriendsMysqlDAO implements IFriendsDAO {
  async getAll(filters: FriendFilters = {}): Promise<Friend[]> {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT 
          a.${FIELDS.idFriend} AS idFriend,
          u1.idUsuario AS idUser1, u1.urlImagen AS urlImg1, 
          u1.nombreUsuario AS userName1, u1.email AS email1,
          u2.idUsuario AS idUser2, u2.urlImagen AS urlImg2, 
          u2.nombreUsuario AS userName2, u2.email AS email2,
          a.${FIELDS.friendRequestState} AS friendRequestState
        FROM ${TABLE_NAME} a
        INNER JOIN usuarios u1 ON a.${FIELDS.idFirstUser} = u1.${FIELDS.idUser}
        INNER JOIN usuarios u2 ON a.${FIELDS.idSecondUser} = u2.${FIELDS.idUser}
        WHERE 1 = 1
      `;

      const params: (string | boolean)[] = [];

      if (
        filters.idFirstUser &&
        filters.idSecondUser &&
        filters.idFirstUser === filters.idSecondUser
      ) {
        // OR lógico si ambos IDs son iguales
        query += ` AND (a.${FIELDS.idFirstUser} = ? OR a.${FIELDS.idSecondUser} = ?)`;
        params.push(filters.idFirstUser, filters.idSecondUser);
      } else {
        if (filters.idFirstUser) {
          query += ` AND a.${FIELDS.idFirstUser} = ?`;
          params.push(filters.idFirstUser);
        }

        if (filters.idSecondUser) {
          query += ` AND a.${FIELDS.idSecondUser} = ?`;
          params.push(filters.idSecondUser);
        }
      }

      if (typeof filters.friendRequestState === "boolean") {
        query += ` AND a.${FIELDS.friendRequestState} = ?`;
        params.push(filters.friendRequestState);
      }

      connection.query(query, params, (err, results: RowDataPacket[]) => {
        if (err) return reject(err);

        if (!Array.isArray(results)) {
          return reject(
            new Error("Expected array of results but got something else.")
          );
        }

        const friends: Friend[] = results.map((row) => {
          const firstUser: UserFriends = {
            idUser: row.idUser1,
            urlImg: row.urlImg1,
            userName: row.userName1,
            email: row.email1,
          };

          const secondUser: UserFriends = {
            idUser: row.idUser2,
            urlImg: row.urlImg2,
            userName: row.userName2,
            email: row.email2,
          };

          return {
            idFriend: row.idFriend,
            firstUser,
            secondUser,
            friendRequestState: !!row.friendRequestState,
          };
        });

        resolve(friends);
      });
    });
  }

  async getById(idFriend: string): Promise<Friend | null> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          a.${FIELDS.idFriend} AS idFriend,
          u1.${FIELDS.idUser} AS idUser1, u1.${FIELDS.urlImage} AS urlImg1, u1.${FIELDS.userName} AS userName1, u1.${FIELDS.email} AS email1,
          u2.${FIELDS.idUser} AS idUser2, u2.${FIELDS.urlImage} AS urlImg2, u2.${FIELDS.userName} AS userName2, u2.${FIELDS.email} AS email2,
          a.${FIELDS.friendRequestState} AS friendRequestState
        FROM ${TABLE_NAME} a
        INNER JOIN usuarios u1 ON a.${FIELDS.idFirstUser} = u1.${FIELDS.idUser}
        INNER JOIN usuarios u2 ON a.${FIELDS.idSecondUser} = u2.${FIELDS.idUser}
        WHERE a.${FIELDS.idFriend} = ?
      `;

      connection.query(
        query,
        [idFriend],
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

            const friend: Friend = {
              idFriend: row.idFriend,
              firstUser: {
                idUser: row.idUser1,
                urlImg: row.urlImg1,
                userName: row.userName1,
                email: row.email1,
              },
              secondUser: {
                idUser: row.idUser2,
                urlImg: row.urlImg2,
                userName: row.userName2,
                email: row.email2,
              },
              friendRequestState: !!row.friendRequestState, // Conversión a booleano
            };

            resolve(friend);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  async create(
    idFriend: string,
    friendReq: FriendCreate
  ): Promise<FriendReturn | null> {
    return new Promise((resolve, reject) => {
      // Definir la consulta de inserción con el idFriend proporcionado
      const query = `
        INSERT INTO ${TABLE_NAME} 
          (${FIELDS.idFriend}, ${FIELDS.idFirstUser}, ${FIELDS.idSecondUser}, ${FIELDS.friendRequestState})
        VALUES 
          (?, ?, ?, ?)
      `;

      // Ejecutar la consulta con los datos de la solicitud de amistad
      connection.query(
        query,
        [
          idFriend,
          friendReq.firstUser,
          friendReq.secondUser,
          friendReq.friendRequestState,
        ],
        (err: any, results: any) => {
          if (err) {
            return reject(err);
          }

          // Si la inserción es exitosa, devolvemos el objeto FriendReturn
          if (results.affectedRows > 0) {
            const friendReturn: FriendReturn = {
              idFriend: idFriend, // Utilizamos el idFriend proporcionado
              firstUser: friendReq.firstUser,
              secondUser: friendReq.secondUser,
              friendRequestState: friendReq.friendRequestState, // Usamos el estado de la solicitud de amistad de friendReq
            };
            resolve(friendReturn);
          } else {
            resolve(null); // Si no se inserta correctamente
          }
        }
      );
    });
  }

  async update(idFriend: string): Promise<FriendReturn | null> {
    return new Promise((resolve, reject) => {
      // Consulta SQL para actualizar solo el campo solicitudAmigoAceptada a true
      const query = `
        UPDATE ${TABLE_NAME} 
        SET ${FIELDS.friendRequestState} = true
        WHERE ${FIELDS.idFriend} = ?
      `;

      // Ejecutar la consulta
      connection.query(query, [idFriend], (err: any, results: any) => {
        if (err) {
          return reject(err);
        }

        // Si no se actualizó ninguna fila, devolvemos null
        if (results.affectedRows === 0) {
          return resolve(null);
        }

        // Devolver el objeto FriendReturn con la actualización
        const friendReturn: FriendReturn = {
          idFriend: idFriend,
          firstUser: "",
          secondUser: "",
          friendRequestState: true,
        };

        resolve(friendReturn); // Devolver el objeto con la actualización
      });
    });
  }

  async delete(idFriend: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Consulta SQL para eliminar un registro por idFriend
      const query = `
        DELETE FROM ${TABLE_NAME}
        WHERE ${FIELDS.idFriend} = ?
      `;

      // Ejecutar la consulta
      connection.query(query, [idFriend], (err: any, results: any) => {
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
