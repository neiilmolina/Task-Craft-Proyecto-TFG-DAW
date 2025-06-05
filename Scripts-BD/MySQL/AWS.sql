-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: tfg-bd.cbummuqkc9d7.eu-north-1.rds.amazonaws.com    Database: proyecto_tfg_daw
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `amigos`
--

DROP TABLE IF EXISTS `amigos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `amigos` (
  `idAmigo` char(36) NOT NULL,
  `idPrimerUsuario` char(36) NOT NULL,
  `idSegundoUsuario` char(36) NOT NULL,
  `solicitudAmigoAceptada` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idAmigo`),
  KEY `fk_idPrimerUsuarioAmigo` (`idPrimerUsuario`),
  KEY `fk_idSegundoUsuarioAmigo` (`idSegundoUsuario`),
  CONSTRAINT `fk_idPrimerUsuarioAmigo` FOREIGN KEY (`idPrimerUsuario`) REFERENCES `usuarios` (`idUsuario`) ON DELETE CASCADE,
  CONSTRAINT `fk_idSegundoUsuarioAmigo` FOREIGN KEY (`idSegundoUsuario`) REFERENCES `usuarios` (`idUsuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `amigos`
--

LOCK TABLES `amigos` WRITE;
/*!40000 ALTER TABLE `amigos` DISABLE KEYS */;
INSERT INTO `amigos` VALUES ('3d47ff9d-4da5-454d-8a76-25272071ad81','1d47c4a5-73f8-40ad-9ca7-dc87c391cf9b','67ed2cd8-0a60-11f0-b542-066ddd4196f1',1),('68bec217-0a60-11f0-b542-066ddd4196f1','67ed3054-0a60-11f0-b542-066ddd4196f1','67ed33d9-0a60-11f0-b542-066ddd4196f1',0);
/*!40000 ALTER TABLE `amigos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `amigos_has_tareas`
--

DROP TABLE IF EXISTS `amigos_has_tareas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `amigos_has_tareas` (
  `idTareaCompartida` char(36) NOT NULL,
  `idAmigo` char(36) NOT NULL,
  `idTarea` char(36) NOT NULL,
  `solicitudTareaAceptada` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idTareaCompartida`),
  KEY `fk_idAmigo` (`idAmigo`),
  KEY `fk_idTareaTarea` (`idTarea`),
  CONSTRAINT `fk_idAmigo` FOREIGN KEY (`idAmigo`) REFERENCES `usuarios` (`idUsuario`),
  CONSTRAINT `fk_idTareaTarea` FOREIGN KEY (`idTarea`) REFERENCES `tareas` (`idTarea`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `amigos_has_tareas`
--

LOCK TABLES `amigos_has_tareas` WRITE;
/*!40000 ALTER TABLE `amigos_has_tareas` DISABLE KEYS */;
INSERT INTO `amigos_has_tareas` VALUES ('f3097048-bb53-4355-9bb9-e45388ea7773','1d47c4a5-73f8-40ad-9ca7-dc87c391cf9b','68980f77-0a60-11f0-b542-066ddd4196f1',0);
/*!40000 ALTER TABLE `amigos_has_tareas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diarios`
--

DROP TABLE IF EXISTS `diarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diarios` (
  `idDiario` char(36) NOT NULL,
  `titulo` varchar(45) DEFAULT NULL,
  `descripcion` text,
  `fechaActividad` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `idUsuario` char(36) DEFAULT NULL,
  PRIMARY KEY (`idDiario`),
  KEY `fk_idUsuarioDiario` (`idUsuario`),
  CONSTRAINT `fk_idUsuarioDiario` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diarios`
--

LOCK TABLES `diarios` WRITE;
/*!40000 ALTER TABLE `diarios` DISABLE KEYS */;
INSERT INTO `diarios` VALUES ('68138bf1-0a60-11f0-b542-066ddd4196f1','Diario de Admin','Este es el primer diario creado por el administrador.','2025-03-26 16:36:02','67ed2cd8-0a60-11f0-b542-066ddd4196f1'),('681393b0-0a60-11f0-b542-066ddd4196f1','Entrenamiento diario','Registro del entrenamiento diario de Pepe.','2025-03-26 16:36:02','67ed3054-0a60-11f0-b542-066ddd4196f1'),('6813957b-0a60-11f0-b542-066ddd4196f1','Reunión de equipo','Admin registró las notas de la reunión de equipo.','2025-03-26 16:36:02','67ed2cd8-0a60-11f0-b542-066ddd4196f1'),('681398c6-0a60-11f0-b542-066ddd4196f1','Sesión de lectura','Pepe registró los libros leídos en su sesión diaria.','2025-03-26 16:36:02','67ed3054-0a60-11f0-b542-066ddd4196f1');
/*!40000 ALTER TABLE `diarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estados`
--

DROP TABLE IF EXISTS `estados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estados` (
  `idEstado` int NOT NULL AUTO_INCREMENT,
  `estado` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idEstado`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estados`
--

LOCK TABLES `estados` WRITE;
/*!40000 ALTER TABLE `estados` DISABLE KEYS */;
INSERT INTO `estados` VALUES (1,'Completado'),(2,'Incompleto'),(3,'En proceso');
/*!40000 ALTER TABLE `estados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `idRol` int NOT NULL AUTO_INCREMENT,
  `rol` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idRol`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'usuario'),(2,'admin'),(3,'Moderador');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tareas`
--

DROP TABLE IF EXISTS `tareas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tareas` (
  `idTarea` char(36) NOT NULL,
  `titulo` varchar(45) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `fechaActividad` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `idEstado` int DEFAULT NULL,
  `idTipo` int DEFAULT NULL,
  `idUsuario` char(36) DEFAULT NULL,
  PRIMARY KEY (`idTarea`),
  KEY `fk_idEstadoTarea` (`idEstado`),
  KEY `fk_idTipoTarea` (`idTipo`),
  KEY `fk_idUsuarioTarea` (`idUsuario`),
  CONSTRAINT `fk_idEstadoTarea` FOREIGN KEY (`idEstado`) REFERENCES `estados` (`idEstado`),
  CONSTRAINT `fk_idTipoTarea` FOREIGN KEY (`idTipo`) REFERENCES `tipos` (`idTipo`),
  CONSTRAINT `fk_idUsuarioTarea` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tareas`
--

LOCK TABLES `tareas` WRITE;
/*!40000 ALTER TABLE `tareas` DISABLE KEYS */;
INSERT INTO `tareas` VALUES ('11dffad1-2bbb-4d10-994e-594532b4a5b9','Tarea de ejemplo 2','Descripción de prueba','2025-04-11 10:00:00',1,1,'67ed2cd8-0a60-11f0-b542-066ddd4196f1'),('11fb309a-bf36-4a1d-8c61-95da18c5f05d','1','Descripción de prueba','2025-04-11 10:00:00',1,1,'67ed2cd8-0a60-11f0-b542-066ddd4196f1'),('212b26fa-2aac-4c20-b968-ecbf854e0822','Tarea de ejemplodddddddddddddddddd','Descripción de prueba','2025-04-11 10:00:00',1,1,'67ed2cd8-0a60-11f0-b542-066ddd4196f1'),('36dd1212-7808-46ca-99e8-dad13bc31e7f','Tarea de ejemplo','Descripción de prueba','2025-04-11 10:00:00',1,1,'67ed2cd8-0a60-11f0-b542-066ddd4196f1'),('6898069f-0a60-11f0-b542-066ddd4196f1','Reunión de trabajo','Reunión con el equipo para revisar el progreso del proyecto.','2025-03-26 16:36:03',2,1,'67ed2cd8-0a60-11f0-b542-066ddd4196f1'),('68980f77-0a60-11f0-b542-066ddd4196f1','Estudio de mercado','Estudio para identificar tendencias del mercado en el sector.','2025-03-26 16:36:03',3,3,'67ed3054-0a60-11f0-b542-066ddd4196f1'),('b4593303-e179-4ebc-a12e-282012e12525','Tarea de ejemplo','Descripción de prueba','2025-04-11 10:00:00',1,1,'67ed2cd8-0a60-11f0-b542-066ddd4196f1');
/*!40000 ALTER TABLE `tareas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos`
--

DROP TABLE IF EXISTS `tipos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos` (
  `idTipo` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(45) DEFAULT NULL,
  `color` varchar(45) DEFAULT NULL,
  `idUsuario` char(36) DEFAULT NULL,
  PRIMARY KEY (`idTipo`),
  KEY `fk_idUsuarioTipo` (`idUsuario`),
  CONSTRAINT `fk_idUsuarioTipo` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos`
--

LOCK TABLES `tipos` WRITE;
/*!40000 ALTER TABLE `tipos` DISABLE KEYS */;
INSERT INTO `tipos` VALUES (1,'Evento','#FF0000',null),(2,'Objetivo','#008000',null),(3,'Estudio','#0000FF',null),(4,'Trabajo','#FF0000',null);
/*!40000 ALTER TABLE `tipos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `idUsuario` char(36) NOT NULL,
  `nombreUsuario` varchar(45) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(256) DEFAULT NULL,
  `urlImagen` varchar(255) DEFAULT NULL,
  `idRol` int DEFAULT '1',
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `nombreUsuario` (`nombreUsuario`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `urlImagen` (`urlImagen`),
  KEY `fk_idRol` (`idRol`),
  CONSTRAINT `fk_idRol` FOREIGN KEY (`idRol`) REFERENCES `roles` (`idRol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES ('00596cbc-5561-49a5-bf35-095e74548e91',NULL,'nuevo22@example.com','$2b$10$PytIhEWPrFNvvyzs.DWd3.iKMBz0jwwqTkWkxZxbT5zKEj1mTLn96',NULL,1),('1d47c4a5-73f8-40ad-9ca7-dc87c391cf9b','nuevoUsuario','nuevo@example.com','$2b$10$Bs2FGTQ0CpWcwzBc3Z1zaOjcbged1JwWZADDNu3c0OpA3EUjK4qAK','https://imagen.com/nuevo.png',1),('501836bc-234c-407f-90c8-c12fbfefeacd',NULL,'nuevo1@example.com','$2b$10$qmO3ADrSjIl71jcI.V.T5Os3DOwwGEqIigYws1fR4t.iDrZ/71vjq',NULL,1),('50e01844-d2c1-4a41-9582-42e0e92471f8',NULL,'ejemplo4@example.com','$2b$10$oiZCQ8wtnv.8rPaWNh5y2e2zwJgXMSfn2R/Xy24PIcIJxuoYIKzP2',NULL,1),('67ed2cd8-0a60-11f0-b542-066ddd4196f1','admin','admin@example.com','$2b$10$DV8QDMZPIvJ0yhBzEd.tue3mgz.DUUN4c5V.aLGMHDXYaJmyi05n2','http://example.com/admin1.jpg',2),('67ed3054-0a60-11f0-b542-066ddd4196f1','Ejemplo','nuevvo@example.com','$2b$10$xfR25K2khe9Gp.b9c9VXpO/taCIo7g1pElPzHQ970n/UjdzWjCWvq',NULL,1),('67ed3229-0a60-11f0-b542-066ddd4196f1','neil_pepe','neil_pepe@example.com','$2b$10$Alf..sodLVi2CjV73S1oYu/UwejVr2NVJ8SCHLYLjC5HH02hM7aNy','http://example.com/neil_pepe.jpg',1),('67ed33d9-0a60-11f0-b542-066ddd4196f1',NULL,'pepe@example.com','$2b$10$Vv5J5KSzbIUJyloKTkL6jeh0RUoAMj0R8QWp3FJk3oOCYKhjbz6','http://example.com/pepe.jpg',1),('95ac4575-e7a9-4fd8-83cb-27a6f664240d',NULL,'pepito@example.com','$2b$10$if8kI5CZIJGW8LuDA3HDCei.WJiBxTWOJx3w//ed1HLHXQN55bfTK','',1),('ce067b1e-736b-4363-b301-2fa4c21b30ef',NULL,'nuevo2@example.com','$2b$10$woy8/uAS5kup0WXIRyiixeTIqMz9axJuKC/eV0/9Or7PdocGoSeZK',NULL,1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-03 18:21:34
