import createApp from "@/src/app";

// Create the model instance with the DAO
import StatesMysqlDAO from "@/src/states/model/dao/StatesMysqlDAO";
import TypesMysqlDAO from "@/src/types/model/dao/TypesMysqlDAO";
import RolesMysqlDAO from "@/src/roles/model/dao/RolesMysqlDAO";
import UsersMysqlDAO from "@/src/users/model/dao/UsersMysqlDAO";
import TaskMysqlDAO from "@/src/tasks/model/dao/TasksMysqlDAO";
import DiariesMysqlDAO from "@/src/diaries/model/dao/DiariesMysqlDAO";
import FriendsMysqlDAO from "@/src/friends/model/dao/FriendsMysqlDAO";

// Create the server
import setupWebSocket from "@/src/socket";
import { createServer } from "http";

// Create the model instance with the DAO
const statesMysqlDAO = new StatesMysqlDAO();
const usersMysqlDAO = new UsersMysqlDAO();
const typesMysqlDAO = new TypesMysqlDAO();
const rolesMysqlDAO = new RolesMysqlDAO();
const tasksMysqlDAO = new TaskMysqlDAO();
const diariesMysqlDAO = new DiariesMysqlDAO();
const friendsMysqlDAO = new FriendsMysqlDAO();

// Pass the model instance to createApp
const app = createApp(
  statesMysqlDAO,
  typesMysqlDAO,
  rolesMysqlDAO,
  usersMysqlDAO,
  tasksMysqlDAO,
  diariesMysqlDAO,
  friendsMysqlDAO
);

const server = createServer(app);

// Inicializamos WebSocket
setupWebSocket(server, friendsMysqlDAO);

// Levantamos el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
