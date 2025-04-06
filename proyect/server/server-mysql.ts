import createApp from "@/src/app";
import EstadosMysqlDAO from "@/src/states/dao/StatesMysqlDAO";
// import UsuariosSupabaseDAO from "@/src/usuarios/dao/UsuariosSupabaseDAO";
import TiposSupabaseDAO from "@/src/types/model/dao/TiposSupabaseDAO";
import RolesMysqlDAO from "@/src/roles/dao/RolesMysqlDAO";
import UsuariosMysqlDAO from "@/src/users/model/dao/UsersMysqlDAO";

// Create the model instance with the DAO
const estadosMysqlDAO = new EstadosMysqlDAO();

const usuariosMysqlDAO = new UsuariosMysqlDAO();

const tiposMysqlDAO = new TiposSupabaseDAO();

const rolesMysqlDAO = new RolesMysqlDAO();

// Pass the model instance to createApp
createApp(estadosMysqlDAO, tiposMysqlDAO, rolesMysqlDAO, usuariosMysqlDAO);
