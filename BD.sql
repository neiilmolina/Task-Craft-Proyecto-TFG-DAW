-- Borrar base de datos y reiniciar
DROP DATABASE IF EXISTS proyecto_tfg_daw;

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS proyecto_tfg_daw;
use proyecto_tfg_daw;

-- Crear tabla roles
CREATE TABLE IF NOT EXISTS roles (
	idRol INT NOT NULL auto_increment primary key,
    rol varchar(45)
);

INSERT INTO roles (rol) 
VALUES ("usuario"), ("admin");
SELECT * FROM roles;

-- Crear tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
	idUsuario  CHAR(36) NOT NULL PRIMARY KEY,
    nombreUsuario varchar(45) unique,
    email varchar(100) unique,
    password varchar(256),
    urlImagen varchar(255) unique,	
    idRol INT,
    CONSTRAINT idRol foreign key (idRol) REFERENCES roles(idRol)
);

INSERT INTO usuarios (idUsuario, nombreUsuario, email, password, urlImagen, idRol)
VALUES 
    ('b6acb1ec-cea8-11ef-a47b-a85e45600cdd', 'admin', 'admin@example.com', SHA2('adminpass789', 256), 'http://example.com/admin1.jpg', 2),
    ('b6acb358-cea8-11ef-a47b-a85e45600cdd', 'neil', 'neil@example.com', SHA2('password123', 256), 'http://example.com/usuario1.jpg', 1),
    ('b6acb3f8-cea8-11ef-a47b-a85e45600cdd', 'pepe', 'pepe@example.com', SHA2('mypassword456', 256), 'http://example.com/usuario2.jpg', 1);
-- Consulta select usuarios:
SELECT  
	u.idUsuario, 
    u.nombreUsuario, 
    u.email,
    u.password,
    u.urLImagen, 
    r.rol
    FROM usuarios u
INNER JOIN roles r 
ON u.idRol = r.idRol;

-- Diarios
CREATE TABLE IF NOT EXISTS diarios(
	idDiario CHAR(36) NOT NULL PRIMARY KEY,
    titulo varchar(45),
    descripcion TEXT,
    fechaActividad TIMESTAMP,
    idUsuario CHAR(36),
    CONSTRAINT idUsuarioDiario FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
);

-- Insertar registros en la tabla diarios
INSERT INTO diarios (idDiario, titulo, descripcion, fechaActividad, idUsuario)
VALUES
    (UUID(), 'Diario de Admin', 'Este es el primer diario creado por el administrador.', NOW(), 'b6acb1ec-cea8-11ef-a47b-a85e45600cdd'),
    (UUID(), 'Viaje a la montaña', 'Descripción del viaje a la montaña realizado por Neil.', NOW(), 'b6acb358-cea8-11ef-a47b-a85e45600cdd'),
    (UUID(), 'Entrenamiento diario', 'Registro del entrenamiento diario de Pepe.', NOW(), 'b6acb3f8-cea8-11ef-a47b-a85e45600cdd'),
    (UUID(), 'Reunión de equipo', 'Admin registró las notas de la reunión de equipo.', NOW(), 'b6acb1ec-cea8-11ef-a47b-a85e45600cdd'),
    (UUID(), 'Diario personal', 'Neil escribió reflexiones personales en su diario.', NOW(), 'b6acb358-cea8-11ef-a47b-a85e45600cdd'),
    (UUID(), 'Sesión de lectura', 'Pepe registró los libros leídos en su sesión diaria.', NOW(), 'b6acb3f8-cea8-11ef-a47b-a85e45600cdd');

-- Consulta select de diarios:
SELECT 
	d.idDiario,
    d.titulo,
    d.descripcion,
    d.fechaActividad,
    u.nombreUsuario
FROM diarios d
INNER JOIN usuarios u 
ON d.idUsuario = u.idUsuario;

-- Crear tipos
CREATE TABLE IF NOT EXISTS tipos(
	idTipo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(45),
    color VARCHAR(45),
    idUsuario CHAR(36),
    CONSTRAINT idUsuarioTipo FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
);

-- Insertar tipos de tareas con colores en formato hexadecimal
INSERT INTO tipos (tipo, color, idUsuario)
VALUES
    ('Evento', '#FF0000', 'b6acb1ec-cea8-11ef-a47b-a85e45600cdd'), 
    ('Objetivo', '#008000', 'b6acb1ec-cea8-11ef-a47b-a85e45600cdd'), 
    ('Estudio', '#0000FF', 'b6acb1ec-cea8-11ef-a47b-a85e45600cdd'); 

-- Verificar los datos insertados
SELECT * FROM tipos;

-- Crear estados
CREATE TABLE IF NOT EXISTS estados(
	idEstado INT NOT NULL auto_increment PRIMARY KEY,
    estado varchar(45)
);
-- Insertar estados de tareas 
INSERT INTO estados (estado)
VALUES ('Completado'), ('Incompleto'), ('En proceso');

SELECT * FROM estados;

-- Crear tareas
CREATE TABLE IF NOT EXISTS tareas(
    idTarea CHAR(36) PRIMARY KEY,
    titulo VARCHAR(45),
    descripcion VARCHAR(255),
    fechaActividad TIMESTAMP,
    idEstado INT,
    idTipo INT,
    idUsuario CHAR(36),
    CONSTRAINT idEstadoTarea FOREIGN KEY (idEstado) REFERENCES estados(idEstado),
    CONSTRAINT idTipoTarea FOREIGN KEY (idTipo) REFERENCES tipos(idTipo),
    CONSTRAINT idUsuarioTarea FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario) -- Corregido el nombre de la tabla 'usuario' a 'usuarios'
);


-- Insertar tareas
INSERT INTO tareas (idTarea, titulo, descripcion, fechaActividad, idEstado, idTipo, idUsuario)
VALUES
    ('a9893b08-cf6f-11ef-9f16-a85e45600cdd', 'Reunión de trabajo', 'Reunión con el equipo para revisar el progreso del proyecto.', NOW(), 2, 1, 'b6acb1ec-cea8-11ef-a47b-a85e45600cdd'),  -- Completado
    ('a98e63bf-cf6f-11ef-9f16-a85e45600cdd', 'Planificación de objetivos', 'Definir los objetivos del siguiente trimestre.', NOW(), 2, 2, 'b6acb358-cea8-11ef-a47b-a85e45600cdd'),  -- Incompleto
    ('a98e64d8-cf6f-11ef-9f16-a85e45600cdd', 'Estudio de mercado', 'Estudio para identificar tendencias del mercado en el sector.', NOW(), 3, 3, 'b6acb3f8-cea8-11ef-a47b-a85e45600cdd'),  -- En proceso
    ('a992981e-cf6f-11ef-9f16-a85e45600cdd', 'Evento de lanzamiento', 'Preparación del evento de lanzamiento del producto.', NOW(), 2, 1, 'b6acb358-cea8-11ef-a47b-a85e45600cdd');  -- Completado

-- Verificar los datos insertados
SELECT 
ta.idTarea,
ta.titulo,
ta.descripcion,
ta.fechaActividad,
e.idEstado,
e.estado,
ti.tipo,
u.nombreUsuario
FROM tareas ta
INNER JOIN estados e
ON ta.idEstado = e.idEstado
INNER JOIN tipos ti
ON ta.idTipo = ti.idTipo
INNER JOIN usuarios u 
ON ta.idUsuario = u.idUsuario;

-- Crear tabla amigos
CREATE TABLE IF NOT EXISTS amigos(
	idPrimerUsuario CHAR(36),
    idSegundoUsuario CHAR(36),
    solicitudAmigoAceptada BOOLEAN,
    
    CONSTRAINT idPrimerUsuarioAmigo FOREIGN KEY (idPrimerUsuario) REFERENCES usuarios(idUsuario),
    CONSTRAINT idSegundorUsuarioAmigo FOREIGN KEY (idSegundoUsuario) REFERENCES usuarios(idUsuario)
);

INSERT INTO amigos (idPrimerUsuario, idSegundoUsuario, solicitudAmigoAceptada)
VALUES
    ('b6acb1ec-cea8-11ef-a47b-a85e45600cdd', 'b6acb358-cea8-11ef-a47b-a85e45600cdd', TRUE), -- admin y neil son amigos
    ('b6acb1ec-cea8-11ef-a47b-a85e45600cdd', 'b6acb3f8-cea8-11ef-a47b-a85e45600cdd', FALSE), -- admin envió solicitud a pepe, no aceptada aún
    ('b6acb358-cea8-11ef-a47b-a85e45600cdd', 'b6acb3f8-cea8-11ef-a47b-a85e45600cdd', TRUE); -- neil y pepe son amigos
    
SELECT 
a.idPrimerUsuario,
u1.nombreUsuario,
a.idSegundoUsuario,
u2.nombreUsuario,
a.solicitudAmigoAceptada
FROM amigos a
INNER JOIN usuarios u1
ON a.idPrimerUsuario = u1.idUsuario
INNER JOIN usuarios u2
ON a.idSegundoUsuario = u2.idUsuario;

-- Crear tabla amigos
CREATE TABLE IF NOT EXISTS amigos_has_tareas(
	idPrimerUsuario CHAR(36),
    idSegundoUsuario CHAR(36),
    idTarea CHAR(36),
    solicitudTareaAceptada BOOLEAN,
    
    CONSTRAINT idPrimerUsuarioTarea FOREIGN KEY (idPrimerUsuario) REFERENCES usuarios(idUsuario),
    CONSTRAINT idSegundorUsuarioTarea FOREIGN KEY (idSegundoUsuario) REFERENCES usuarios(idUsuario),
    CONSTRAINT idTareaTarea FOREIGN KEY (idTarea) REFERENCES tareas(idTarea)
);

INSERT INTO amigos_has_tareas (idPrimerUsuario, idSegundoUsuario, idTarea, solicitudTareaAceptada)
VALUES
    ('b6acb1ec-cea8-11ef-a47b-a85e45600cdd', 'b6acb358-cea8-11ef-a47b-a85e45600cdd', 'a9893b08-cf6f-11ef-9f16-a85e45600cdd', TRUE), -- admin y neil comparten Reunión de Trabajo
    ('b6acb358-cea8-11ef-a47b-a85e45600cdd', 'b6acb3f8-cea8-11ef-a47b-a85e45600cdd', 'a992981e-cf6f-11ef-9f16-a85e45600cdd', TRUE); -- neil y pepe comparten Evento de lanzamiento.
    
SELECT 
aht.idPrimerUsuario as nombrePrimerUsuario,
u1.nombreUsuario,
aht.idSegundoUsuario,
u2.nombreUsuario as nombreSegundoUsuario,
aht.solicitudTareaAceptada,
ta.idTarea,
u3.nombreUsuario as creador,
ta.titulo,
ta.descripcion,
ta.fechaActividad,
e.estado,
ti.tipo
FROM 
amigos_has_tareas aht

INNER JOIN usuarios u1
ON aht.idPrimerUsuario = u1.idUsuario
INNER JOIN usuarios u2
ON aht.idSegundoUsuario = u2.idUsuario

INNER JOIN tareas ta
ON aht.idTarea = ta.idTarea
INNER JOIN estados e
ON ta.idEstado = e.idEstado
INNER JOIN tipos ti
ON ta.idTipo = ti.idTipo
INNER JOIN usuarios u3 
ON ta.idUsuario = u3.idUsuario;