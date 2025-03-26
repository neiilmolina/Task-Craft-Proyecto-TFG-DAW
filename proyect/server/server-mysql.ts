import createApp from "@/src/app";
import EstadosMysqlDAO from "@/src/estados/dao/EstadosMysqlDAO";
import UsuariosSupabaseDAO from "@/src/usuarios/dao/UsuariosSupabaseDAO";
import TiposSupabaseDAO from "@/src/tipos/dao/TiposSupabaseDAO";
import RolesMysqlDAO from "@/src/roles/dao/RolesMysqlDAO";

// Create the model instance with the DAO
const estadosMysqlDAO = new EstadosMysqlDAO();

const usuariosMysqlDAO = new UsuariosSupabaseDAO();

const tiposMysqlDAO = new TiposSupabaseDAO();

const rolesMysqlDAO = new RolesMysqlDAO();
// Pass the model instance to createApp
createApp(estadosMysqlDAO, usuariosMysqlDAO, tiposMysqlDAO, rolesMysqlDAO);
