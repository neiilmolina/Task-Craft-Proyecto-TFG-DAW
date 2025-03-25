import mysql from "mysql2";

// Crea la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

// Conecta a la base de datos
connection.connect((err) => {
  if (err) {
    console.error("Error de conexión: " + err.stack);
    return;
  }
  console.log("Conectado como ID " + connection.threadId);
});

// Exporta la conexión para usarla en otros archivos
export default connection;
