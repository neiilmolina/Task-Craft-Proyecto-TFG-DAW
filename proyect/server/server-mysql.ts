import createApp from "@/src/app";
import StatesMysqlDAO from "@/src/states/model/dao/StatesMysqlDAO";
// import UsuariosSupabaseDAO from "@/src/usuarios/dao/UsuariosSupabaseDAO";
import TypesMysqlDAO from "@/src/types/model/dao/TypesMysqlDAO";
import RolesMysqlDAO from "@/src/roles/model/dao/RolesMysqlDAO";
import UsersMysqlDAO from "@/src/users/model/dao/UsersMysqlDAO";
import TaskMysqlDAO from "@/src/tasks/model/dao/TasksMysqlDAO";

// Create the model instance with the DAO
const statesMysqlDAO = new StatesMysqlDAO();

const usersMysqlDAO = new UsersMysqlDAO();

const typesMysqlDAO = new TypesMysqlDAO();

const rolesMysqlDAO = new RolesMysqlDAO();

const tasksMysqlDAO = new TaskMysqlDAO();

// Pass the model instance to createApp
createApp(
  statesMysqlDAO,
  typesMysqlDAO,
  rolesMysqlDAO,
  usersMysqlDAO,
  tasksMysqlDAO
);
