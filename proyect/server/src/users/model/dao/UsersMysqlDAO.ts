import { User, UserCreate, UserReturn, UserUpdate } from "task-craft-models";
import IUsersDAO from "@/src/users/model/dao/IUsersDAO";
import connection from "@/config/mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs";

const TABLE_NAME = "usuarios";
const FIELDS = {
  idUser: "idUsuario",
  userName: "nombreUsuario",
  email: "email",
  password: "password",
  urlImg: "urlImagen",
  idRole: "idRol",
};

export default class UsersMysqlDAO implements IUsersDAO {
  async getAll(idRol?: number, stringSearch?: string): Promise<User[]> {
    return new Promise<User[]>((resolve, reject) => {
      let query = `
        SELECT 
          u.${FIELDS.idUser}, 
          u.${FIELDS.userName}, 
          u.${FIELDS.email}, 
          u.${FIELDS.urlImg}, 
          r.idRol AS idRol, 
          r.rol AS rol 
        FROM ${TABLE_NAME} u
        JOIN roles r ON u.${FIELDS.idRole} = r.idRol
      `;

      const conditions: string[] = [];
      const params: any[] = [];

      if (idRol) {
        conditions.push(`u.${FIELDS.idRole} = ?`);
        params.push(idRol);
      }

      if (stringSearch) {
        conditions.push(
          `(u.${FIELDS.userName} LIKE ? OR u.${FIELDS.email} LIKE ?)`
        );
        const likeValue = `%${stringSearch}%`;
        params.push(likeValue, likeValue);
      }

      if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(" AND ");
      }

      connection.query(query, params, (err: any, results: RowDataPacket[]) => {
        if (err) {
          console.error("Error al obtener usuarios:", err);
          return reject(err);
        }

        if (!Array.isArray(results)) {
          return reject(
            new Error("Expected array of results but got something else.")
          );
        }

        const users: User[] = results.map((row) => ({
          idUser: row[FIELDS.idUser],
          userName: row[FIELDS.userName],
          email: row[FIELDS.email],
          urlImg: row[FIELDS.urlImg] || null,
          role: {
            idRole: row.idRol,
            role: row.rol,
          },
        }));

        resolve(users);
      });
    });
  }

  async getById(id: string): Promise<User | null> {
    return new Promise<User | null>((resolve, reject) => {
      const query = `SELECT u.${FIELDS.idUser}, u.${FIELDS.userName}, u.${FIELDS.email}, u.${FIELDS.urlImg}, r.idRol, r.rol 
                     FROM ${TABLE_NAME} u 
                     JOIN roles r ON u.${FIELDS.idRole} = r.idRol 
                     WHERE u.${FIELDS.idUser} = ?`;

      connection.query(query, [id], (err: any, results: RowDataPacket[]) => {
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
          const usuario: User = {
            idUser: row[FIELDS.idUser],
            userName: row[FIELDS.userName],
            email: row[FIELDS.email],
            urlImg: row[FIELDS.urlImg] || null,
            role: {
              idRole: row.idRol,
              role: row.rol,
            },
          };
          resolve(usuario);
        } else {
          resolve(null);
        }
      });
    });
  }

  async getByCredentials(
    email: string,
    password: string
  ): Promise<User | null> {
    return new Promise<User | null>((resolve, reject) => {
      const query = `SELECT u.${FIELDS.idUser}, u.${FIELDS.userName}, u.${FIELDS.email}, u.${FIELDS.urlImg}, 
                            u.password, r.idRol, r.rol 
                     FROM ${TABLE_NAME} u 
                     JOIN roles r ON u.${FIELDS.idRole} = r.idRol 
                     WHERE u.${FIELDS.email} = ?`;

      connection.query(
        query,
        [email],
        async (err: any, results: RowDataPacket[]) => {
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

            // Comparar contraseña usando bcrypt
            const passwordMatch = await bcrypt.compare(password, row.password);

            if (!passwordMatch) {
              return resolve(null); // Contraseña incorrecta
            }

            const usuario: User = {
              idUser: row[FIELDS.idUser],
              userName: row[FIELDS.userName],
              email: row[FIELDS.email],
              urlImg: row[FIELDS.urlImg] || null,
              role: {
                idRole: row.idRol,
                role: row.rol,
              },
            };
            resolve(usuario);
          } else {
            resolve(null); // Usuario no encontrado
          }
        }
      );
    });
  }

  async create(idUser: string, user: UserCreate): Promise<UserReturn | null> {
    return new Promise<UserReturn>((resolve, reject) => {
      const query = `INSERT INTO ${TABLE_NAME} (${FIELDS.idUser}, ${FIELDS.userName}, ${FIELDS.email}, ${FIELDS.password}, ${FIELDS.urlImg}, ${FIELDS.idRole}) VALUES (?, ?, ?, ?, ?, ?)`;

      connection.query(
        query,
        [
          idUser,
          user.userName ?? null,
          user.email,
          user.password,
          user.urlImg ?? null,
          user.idRole ?? 1,
        ],
        (err: any, results: any) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") return reject(err);

            return reject(new Error("Error en la inserción de usuario"));
          }

          resolve({
            userName: user.userName ?? null,
            email: user.email,
            urlImg: user.urlImg ?? null,
            idRole: user.idRole ?? 1,
            idUser: idUser,
          });
        }
      );
    });
  }

  async update(id: string, user: UserUpdate): Promise<UserReturn | null> {
    return new Promise<UserReturn>((resolve, reject) => {
      const query = `UPDATE ${TABLE_NAME} SET
                      ${FIELDS.userName} = ?, 
                      ${FIELDS.email} = ?, 
                      ${FIELDS.urlImg} = ?, 
                      ${FIELDS.idRole} = ? 
                      WHERE ${FIELDS.idUser} = ?`;

      connection.query(
        query,
        [user.userName, user.email, user.urlImg, user.idRole, id],
        (err: any, results: any) => {
          if (err) {
            return reject(
              new Error(`Database update error:  + ${err.message}`)
            );
          }

          const resultSet = results as ResultSetHeader;

          if (resultSet.affectedRows === 0) {
            return reject(new Error("usuario no encontrado"));
          }

          resolve({
            idUser: id,
            userName: user.userName,
            email: user.email,
            urlImg: user.urlImg,
            idRole: user.idRole,
          } as UserReturn);
        }
      );
    });
  }

  updatePassword(id: string, password: string): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      const query = `UPDATE ${TABLE_NAME} SET
      ${FIELDS.password} = ?
      WHERE ${FIELDS.idUser} = ?`;

      connection.query(query, [password, id], (err: any, results: any) => {
        if (err) {
          return reject(new Error(`Database update error:  + ${err.message}`)); // Lanza un error con mensaje detallado
        }

        const resultSet = results as ResultSetHeader;

        if (resultSet.affectedRows === 0) {
          return reject(new Error("User not found"));
        }

        // Resolver con el resultado
        resolve(true);
      });
    });
  }

  updateEmail(id: string, email: string): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      const query = `UPDATE ${TABLE_NAME} SET
      ${FIELDS.email} = ?
      WHERE ${FIELDS.idUser} = ?`;

      connection.query(query, [email, id], (err: any, results: any) => {
        if (err) {
          return reject(new Error(`Database update error:  + ${err.message}`)); // Lanza un error con mensaje detallado
        }

        const resultSet = results as ResultSetHeader;

        if (resultSet.affectedRows === 0) {
          return reject(new Error("User not found"));
        }

        // Resolver con el resultado
        resolve(true);
      });
    });
  }

  updateUserName(id: string, userName: string): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      const query = `UPDATE ${TABLE_NAME} SET
      ${FIELDS.userName} = ?
      WHERE ${FIELDS.idUser} = ?`;

      connection.query(query, [userName, id], (err: any, results: any) => {
        if (err) {
          // Preservar las propiedades específicas del error de MySQL
          if (err.code === "ER_DUP_ENTRY") {
            const duplicateError = new Error(
              `Database update error: ${err.message}`
            );
            (duplicateError as any).code = err.code;
            (duplicateError as any).errno = err.errno;
            (duplicateError as any).sqlState = err.sqlState;
            return reject(duplicateError);
          }

          // Para otros errores, mantener el comportamiento actual
          return reject(new Error(`Database update error: ${err.message}`));
        }

        const resultSet = results as ResultSetHeader;

        if (resultSet.affectedRows === 0) {
          return reject(new Error("User not found"));
        }

        // Resolver con el resultado
        resolve(true);
      });
    });
  }

  async delete(id: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const query = `DELETE FROM ${TABLE_NAME} WHERE ${FIELDS.idUser} = ?`;
      connection.query(query, [id], (err: any, results: any) => {
        if (err) {
          return reject(err);
        }
        const resultSet = results as ResultSetHeader;
        if (resultSet.affectedRows === 0) {
          return reject(new Error("Usuario no encontrado"));
        }
        resolve(true);
      });
    });
  }
}
