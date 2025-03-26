-- Borrar base de datos y reiniciar
DROP DATABASE IF EXISTS proyecto_tfg_daw;

-- Crear base de datos
CREATE DATABASE proyecto_tfg_daw;
USE proyecto_tfg_daw;

-- Crear tabla roles
CREATE TABLE IF NOT EXISTS roles (
    idRol INT AUTO_INCREMENT PRIMARY KEY,
    rol VARCHAR(45)
);

INSERT INTO roles (rol) 
VALUES ('usuario'), ('admin');
SELECT * FROM roles;

-- Crear tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    idUsuario CHAR(36) PRIMARY KEY,
    nombreUsuario VARCHAR(45) UNIQUE,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(256),
    urlImagen VARCHAR(255) UNIQUE,    
    idRol INT DEFAULT 1,
    CONSTRAINT fk_idRol FOREIGN KEY (idRol) REFERENCES roles(idRol)
);

-- Inserción de usuarios faltantes
INSERT INTO usuarios (idUsuario, nombreUsuario, email, password, urlImagen, idRol)
VALUES 
    (UUID(), 'admin', 'admin@example.com', SHA2('adminpass789', 256), 'http://example.com/admin1.jpg', 2),
    (UUID(), 'admin_pepe', 'admin_pepe@example.com', SHA2('adminpepe123', 256), 'http://example.com/admin_pepe.jpg', 1),
    (UUID(), 'neil_pepe', 'neil_pepe@example.com', SHA2('neilpepe123', 256), 'http://example.com/neil_pepe.jpg', 1),
    (UUID(), 'neil', 'neil@example.com', SHA2('neil123', 256), 'http://example.com/neil.jpg', 1), -- Usuario "neil"
    (UUID(), 'pepe', 'pepe@example.com', SHA2('pepe123', 256), 'http://example.com/pepe.jpg', 1); -- Usuario "pepe"

-- Consulta select usuarios:
SELECT  
    u.idUsuario, 
    u.nombreUsuario, 
    u.email,
    u.password,
    u.urlImagen, 
    r.rol
FROM usuarios u
INNER JOIN roles r 
ON u.idRol = r.idRol;

-- Crear tabla diarios
CREATE TABLE IF NOT EXISTS diarios(
    idDiario CHAR(36) PRIMARY KEY,
    titulo VARCHAR(45),
    descripcion TEXT,
    fechaActividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    idUsuario CHAR(36),
    CONSTRAINT fk_idUsuarioDiario FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
);

-- Insertar registros en la tabla diarios
INSERT INTO diarios (idDiario, titulo, descripcion, fechaActividad, idUsuario)
VALUES
    (UUID(), 'Diario de Admin', 'Este es el primer diario creado por el administrador.', NOW(), (SELECT idUsuario FROM usuarios WHERE nombreUsuario = 'admin' LIMIT 1)),
    (UUID(), 'Viaje a la montaña', 'Descripción del viaje a la montaña realizado por Neil.', NOW(), (SELECT idUsuario FROM usuarios WHERE nombreUsuario = 'neil' LIMIT 1)),
    (UUID(), 'Entrenamiento diario', 'Registro del entrenamiento diario de Pepe.', NOW(), (SELECT idUsuario FROM usuarios WHERE nombreUsuario = 'admin_pepe' LIMIT 1)),
    (UUID(), 'Reunión de equipo', 'Admin registró las notas de la reunión de equipo.', NOW(), (SELECT idUsuario FROM usuarios WHERE nombreUsuario = 'admin' LIMIT 1)),
    (UUID(), 'Diario personal', 'Neil escribió reflexiones personales en su diario.', NOW(), (SELECT idUsuario FROM usuarios WHERE nombreUsuario = 'neil' LIMIT 1)),
    (UUID(), 'Sesión de lectura', 'Pepe registró los libros leídos en su sesión diaria.', NOW(), (SELECT idUsuario FROM usuarios WHERE nombreUsuario = 'admin_pepe' LIMIT 1)); 

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
    idTipo INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(45),
    color VARCHAR(45),
    idUsuario CHAR(36),
    CONSTRAINT fk_idUsuarioTipo FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
);

-- Insertar tipos de tareas con colores en formato hexadecimal
INSERT INTO tipos (tipo, color, idUsuario)
VALUES
    ('Evento', '#FF0000', (SELECT idUsuario FROM usuarios WHERE nombreUsuario = 'admin' LIMIT 1)), 
    ('Objetivo', '#008000', (SELECT idUsuario FROM usuarios WHERE nombreUsuario = 'admin' LIMIT 1)), 
    ('Estudio', '#0000FF', (SELECT idUsuario FROM usuarios WHERE nombreUsuario = 'admin' LIMIT 1)); 

-- Verificar los datos insertados
SELECT * FROM tipos;

-- Crear estados
CREATE TABLE IF NOT EXISTS estados(
    idEstado INT AUTO_INCREMENT PRIMARY KEY,
    estado VARCHAR(45)
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
    fechaActividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    idEstado INT,
    idTipo INT,
    idUsuario CHAR(36),
    CONSTRAINT fk_idEstadoTarea FOREIGN KEY (idEstado) REFERENCES estados(idEstado),
    CONSTRAINT fk_idTipoTarea FOREIGN KEY (idTipo) REFERENCES tipos(idTipo),
    CONSTRAINT fk_idUsuarioTarea FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
);

-- Insertar tareas
INSERT INTO tareas (idTarea, titulo, descripcion, fechaActividad, idEstado, idTipo, idUsuario)
VALUES
    (UUID(), 'Reunión de trabajo', 'Reunión con el equipo para revisar el progreso del proyecto.', NOW(), 2, 1, (SELECT idUsuario FROM usuarios WHERE nombreUsuario = 'admin' LIMIT 1)),  -- Completado
    (UUID(), 'Planificación de objetivos', 'Definir los objetivos del siguiente trimestre.', NOW(), 2, 2, (SELECT idUsuario FROM usuarios WHERE nombreUsuario = 'neil' LIMIT 1)),  -- Incompleto
    (UUID(), 'Estudio de mercado', 'Estudio para identificar tendencias del mercado en el sector.', NOW(), 3, 3, (SELECT idUsuario FROM usuarios WHERE nombreUsuario = 'admin_pepe' LIMIT 1)),  -- En proceso
    (UUID(), 'Evento de lanzamiento', 'Preparación del evento de lanzamiento del producto.', NOW(), 2, 1, (SELECT idUsuario FROM usuarios WHERE nombreUsuario = 'neil' LIMIT 1));  -- Completado

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
CREATE TABLE IF NOT EXISTS amigos (
    idAmigo CHAR(36) PRIMARY KEY,
    idPrimerUsuario CHAR(36) NOT NULL,
    idSegundoUsuario CHAR(36) NOT NULL,
    solicitudAmigoAceptada BOOLEAN DEFAULT FALSE,
    
    CONSTRAINT fk_idPrimerUsuarioAmigo FOREIGN KEY (idPrimerUsuario) REFERENCES usuarios(idUsuario),
    CONSTRAINT fk_idSegundoUsuarioAmigo FOREIGN KEY (idSegundoUsuario) REFERENCES usuarios(idUsuario)
);

-- Inserciones de amigos
INSERT INTO amigos (idAmigo, idPrimerUsuario, idSegundoUsuario, solicitudAmigoAceptada)
VALUES
    (UUID(), (SELECT idUsuario FROM usuarios WHERE nombreUsuario = 'admin' LIMIT 1), (SELECT idUsuario FROM usuarios WHERE nombreUsuario = 'neil' LIMIT 1), TRUE), 
    (UUID(), (SELECT idUsuario FROM usuarios WHERE nombreUsuario = 'admin_pepe' LIMIT 1), (SELECT idUsuario FROM usuarios WHERE nombreUsuario = 'pepe' LIMIT 1), FALSE), 
    (UUID(), (SELECT idUsuario FROM usuarios WHERE nombreUsuario = 'neil' LIMIT 1), (SELECT idUsuario FROM usuarios WHERE nombreUsuario = 'pepe' LIMIT 1), TRUE);

-- Crear tabla amigos_has_tareas (con idTareaCompartida como clave primaria)
CREATE TABLE IF NOT EXISTS amigos_has_tareas (
    idTareaCompartida CHAR(36) PRIMARY KEY, -- Nueva clave primaria
    idAmigo CHAR(36) NOT NULL,
    idTarea CHAR(36) NOT NULL,
    solicitudTareaAceptada BOOLEAN DEFAULT FALSE,
    
    CONSTRAINT fk_idAmigo FOREIGN KEY (idAmigo) REFERENCES amigos(idAmigo),
    CONSTRAINT fk_idTareaTarea FOREIGN KEY (idTarea) REFERENCES tareas(idTarea)
);

-- Inserciones en amigos_has_tareas con idTareaCompartida como clave primaria
INSERT INTO amigos_has_tareas (idTareaCompartida, idAmigo, idTarea, solicitudTareaAceptada)
VALUES
    (UUID(), (SELECT idAmigo FROM amigos WHERE idPrimerUsuario = (SELECT idUsuario FROM usuarios WHERE nombreUsuario = 'admin' LIMIT 1) AND idSegundoUsuario = (SELECT idUsuario FROM usuarios WHERE nombreUsuario = 'neil' LIMIT 1) LIMIT 1), (SELECT idTarea FROM tareas WHERE titulo = 'Reunión de trabajo' LIMIT 1), TRUE),
    (UUID(), (SELECT idAmigo FROM amigos WHERE idPrimerUsuario = (SELECT idUsuario FROM usuarios WHERE nombreUsuario = 'neil' LIMIT 1) AND idSegundoUsuario = (SELECT idUsuario FROM usuarios WHERE nombreUsuario = 'pepe' LIMIT 1) LIMIT 1), (SELECT idTarea FROM tareas WHERE titulo = 'Evento de lanzamiento' LIMIT 1), TRUE);

-- Consulta para ver las tareas compartidas entre amigos
SELECT 
    aht.idTareaCompartida,
    u1.nombreUsuario AS nombrePrimerUsuario,
    u2.nombreUsuario AS nombreSegundoUsuario,
    aht.solicitudTareaAceptada,
    ta.idTarea,
    u3.nombreUsuario AS creador,
    ta.titulo,
    ta.descripcion,
    ta.fechaActividad,
    e.estado,
    ti.tipo
FROM amigos_has_tareas aht
INNER JOIN amigos a
    ON aht.idAmigo = a.idAmigo
INNER JOIN usuarios u1
    ON a.idPrimerUsuario = u1.idUsuario
INNER JOIN usuarios u2
    ON a.idSegundoUsuario = u2.idUsuario
INNER JOIN tareas ta
    ON aht.idTarea = ta.idTarea
INNER JOIN estados e
    ON ta.idEstado = e.idEstado
INNER JOIN tipos ti
    ON ta.idTipo = ti.idTipo
LEFT JOIN usuarios u3 
    ON ta.idUsuario = u3.idUsuario;
