import {
  Usuario,
  UsuarioCreate,
  UsuarioReturn,
  UsuarioUpdate,
} from "@/src/usuarios/interfacesUsuarios";
import IUsuariosDAO from "@/src/usuarios/dao/IUsuariosDAO";
import connection from "@/config/mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";

const TABLE_NAME = "usuarios";
const FIELDS = {
  idUsuario: "idUsuario",
  nombreUsuario: "nombreUsuario",
  email: "email",
  password: "password",
  urlImg: "urlImagen",
  idRol: "idRol",
};

export default class UsuariosMysqlDAO implements IUsuariosDAO {
  async getAll(idRol?: Number): Promise<Usuario[]> {
    return new Promise<Usuario[]>((resolve, reject) => {
      let query = `SELECT u.${FIELDS.idUsuario}, u.${FIELDS.nombreUsuario}, u.${FIELDS.email}, 
                            u.${FIELDS.urlImg}, 
                            r.idRol AS idRol, r.rol AS rol 
                     FROM ${TABLE_NAME} u 
                     JOIN roles r ON u.${FIELDS.idRol} = r.idRol`;

      if (idRol) {
        query += ` WHERE u.${FIELDS.idRol} = ?`;
      }

      connection.query(
        query,
        idRol ? [idRol] : [],
        (err, results: RowDataPacket[]) => {
          if (err) {
            return reject(err);
          }

          if (!Array.isArray(results)) {
            return reject(
              new Error("Expected array of results but got something else.")
            );
          }

          const usuarios: Usuario[] = results.map((row) => {
            return {
              idUsuario: row[FIELDS.idUsuario],
              nombreUsuario: row[FIELDS.nombreUsuario],
              email: row[FIELDS.email],
              urlImg: row[FIELDS.urlImg] || null,
              rol: {
                idRol: row.idRol,
                rol: row.rol,
              },
            };
          });

          resolve(usuarios);
        }
      );
    });
  }

  async getById(id: string): Promise<Usuario | null> {
    return new Promise<Usuario | null>((resolve, reject) => {
      const query = `SELECT u.${FIELDS.idUsuario}, u.${FIELDS.nombreUsuario}, u.${FIELDS.email}, u.${FIELDS.urlImg}, r.idRol, r.rol 
                     FROM ${TABLE_NAME} u 
                     JOIN roles r ON u.${FIELDS.idRol} = r.idRol 
                     WHERE u.${FIELDS.idUsuario} = ?`;

      connection.query(query, [id], (err, results: RowDataPacket[]) => {
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
          const usuario: Usuario = {
            idUsuario: row[FIELDS.idUsuario],
            nombreUsuario: row[FIELDS.nombreUsuario],
            email: row[FIELDS.email],
            urlImg: row[FIELDS.urlImg] || null,
            rol: {
              idRol: row.idRol,
              rol: row.rol,
            },
          };
          resolve(usuario);
        } else {
          resolve(null);
        }
      });
    });
  }

  async create(usuario: UsuarioCreate): Promise<UsuarioReturn | null> {
    return new Promise<UsuarioReturn>((resolve, reject) => {
      const query = `INSERT INTO ${TABLE_NAME} (${FIELDS.idUsuario}, ${FIELDS.nombreUsuario}, ${FIELDS.email}, ${FIELDS.password}, ${FIELDS.urlImg}, ${FIELDS.idRol}) VALUES (?, ?, ?, ?, ?, ?)`;

      connection.query(
        query,
        [
          usuario.idUsuario,
          usuario.nombreUsuario || "", // Si `nombreUsuario` es `undefined`, lo asignamos como una cadena vacía
          usuario.email,
          usuario.password,
          usuario.urlImg || "", // Si `urlImg` es `undefined`, lo asignamos como una cadena vacía
          usuario.idRol || 1, // Si `idRol` es `undefined`, lo asignamos como 1
        ],
        (err, results) => {
          if (err) {
            return reject(new Error("Database insertion error")); // Lanza un error específico
          }
          resolve({
            nombreUsuario: usuario.nombreUsuario ?? "",
            email: usuario.email,
            urlImg: usuario.urlImg ?? "",
            idRol: usuario.idRol || 1,
            idUsuario: usuario.idUsuario,
          });
        }
      );
    });
  }

  async update(
    id: string,
    usuario: UsuarioUpdate
  ): Promise<UsuarioReturn | null> {
    return new Promise<UsuarioReturn>((resolve, reject) => {
      const query = `UPDATE ${TABLE_NAME} SET
                      ${FIELDS.nombreUsuario} = ?, 
                      ${FIELDS.email} = ?, 
                      ${FIELDS.password} = ?, 
                      ${FIELDS.urlImg} = ?, 
                      ${FIELDS.idRol} = ? 
                      WHERE ${FIELDS.idUsuario} = ?`;

      connection.query(
        query,
        [
          usuario.nombreUsuario,
          usuario.email,
          usuario.password,
          usuario.urlImg,
          usuario.idRol,
          id,
        ],
        (err, results) => {
          if (err) {
            return reject(new Error("Database update error: " + err.message)); // Lanza un error con mensaje detallado
          }

          const resultSet = results as ResultSetHeader;

          if (resultSet.affectedRows === 0) {
            return reject(new Error("User not found"));
          }

          // Resolver con el resultado
          resolve({
            idUsuario: id,
            nombreUsuario: usuario.nombreUsuario,
            email: usuario.email,
            urlImg: usuario.urlImg,
            idRol: usuario.idRol,
          } as UsuarioReturn);
        }
      );
    });
  }

  async delete(id: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const query = `DELETE FROM ${TABLE_NAME} WHERE ${FIELDS.idUsuario} = ?`;
      connection.query(query, [id], (err, results) => {
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
