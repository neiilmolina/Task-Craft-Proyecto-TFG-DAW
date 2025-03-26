-- TRIGGERS
-- Crear tabla de auditoría para registrar eliminaciones
CREATE TABLE IF NOT EXISTS roles_eliminados (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idRol INT NOT NULL,
    rol VARCHAR(45),
    eliminado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger BEFORE INSERT
DELIMITER $$
CREATE TRIGGER before_insert_roles
BEFORE INSERT ON roles
FOR EACH ROW
BEGIN
    IF NEW.rol IS NULL OR TRIM(NEW.rol) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo rol no puede ser nulo o vacío.';
    END IF;
END$$
DELIMITER ;

-- Trigger BEFORE UPDATE
DELIMITER $$
CREATE TRIGGER before_update_roles
BEFORE UPDATE ON roles
FOR EACH ROW
BEGIN
    IF NEW.rol IS NULL OR TRIM(NEW.rol) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo rol no puede ser actualizado a un valor nulo o vacío.';
    END IF;
END$$
DELIMITER ;

-- Trigger AFTER DELETE
DELIMITER $$
CREATE TRIGGER after_delete_roles
AFTER DELETE ON roles
FOR EACH ROW
BEGIN
    INSERT INTO roles_eliminados (idRol, rol)
    VALUES (OLD.idRol, OLD.rol);
END$$
DELIMITER ;

-- Crear tabla de auditoría para actualizaciones en roles
CREATE TABLE IF NOT EXISTS roles_actualizaciones (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idRol INT,
    rol_old VARCHAR(45),
    rol_new VARCHAR(45),
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger AFTER UPDATE para roles
DELIMITER $$
CREATE TRIGGER after_update_roles
AFTER UPDATE ON roles
FOR EACH ROW
BEGIN
    INSERT INTO roles_actualizaciones (
        idRol, rol_old, rol_new
    )
    VALUES (
        OLD.idRol, OLD.rol, NEW.rol
    );
END$$
DELIMITER ;

-- Crear tabla de auditoría para registrar eliminaciones
CREATE TABLE IF NOT EXISTS usuarios_eliminados (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idUsuario CHAR(36),
    nombreUsuario VARCHAR(45),
    email VARCHAR(100),
    eliminado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger BEFORE INSERT: Validar datos antes de insertar
DELIMITER $$
CREATE TRIGGER before_insert_usuarios
BEFORE INSERT ON usuarios
FOR EACH ROW
BEGIN
    IF NEW.email IS NULL OR TRIM(NEW.email) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo email no puede ser nulo o vacío.';
    END IF;
    IF NEW.password IS NULL OR TRIM(NEW.password) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo password no puede ser nulo o vacío.';
    END IF;
    IF NEW.nombreUsuario IS NULL OR TRIM(NEW.nombreUsuario) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo nombreUsuario no puede ser nulo o vacío.';
    END IF;
END$$
DELIMITER ;

-- Trigger BEFORE UPDATE: Validar datos antes de actualizar
DELIMITER $$
CREATE TRIGGER before_update_usuarios
BEFORE UPDATE ON usuarios
FOR EACH ROW
BEGIN
    IF NEW.email IS NULL OR TRIM(NEW.email) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo email no puede ser actualizado a un valor nulo o vacío.';
    END IF;
    IF NEW.password IS NULL OR TRIM(NEW.password) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo password no puede ser actualizado a un valor nulo o vacío.';
    END IF;
END$$
DELIMITER ;

-- Trigger AFTER DELETE: Registrar eliminación en auditoría
DELIMITER $$
CREATE TRIGGER after_delete_usuarios
AFTER DELETE ON usuarios
FOR EACH ROW
BEGIN
    INSERT INTO usuarios_eliminados (idUsuario, nombreUsuario, email)
    VALUES (OLD.idUsuario, OLD.nombreUsuario, OLD.email);
END$$
DELIMITER ;

-- Crear tabla de auditoría para actualizaciones en usuarios
CREATE TABLE IF NOT EXISTS usuarios_actualizaciones (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idUsuario CHAR(36),
    nombreUsuario_old VARCHAR(45),
    nombreUsuario_new VARCHAR(45),
    email_old VARCHAR(100),
    email_new VARCHAR(100),
    password_old VARCHAR(256),
    password_new VARCHAR(256),
    urlImagen_old VARCHAR(255),
    urlImagen_new VARCHAR(255),
    idRol_old INT,
    idRol_new INT,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger AFTER UPDATE para usuarios
DELIMITER $$
CREATE TRIGGER after_update_usuarios
AFTER UPDATE ON usuarios
FOR EACH ROW
BEGIN
    INSERT INTO usuarios_actualizaciones (
        idUsuario,
        nombreUsuario_old, nombreUsuario_new,
        email_old, email_new,
        password_old, password_new,
        urlImagen_old, urlImagen_new,
        idRol_old, idRol_new
    )
    VALUES (
        OLD.idUsuario,
        OLD.nombreUsuario, NEW.nombreUsuario,
        OLD.email, NEW.email,
        OLD.password, NEW.password,
        OLD.urlImagen, NEW.urlImagen,
        OLD.idRol, NEW.idRol
    );
END$$
DELIMITER ;


-- Crear tabla de auditoría para registrar eliminaciones
CREATE TABLE IF NOT EXISTS diarios_eliminados (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idDiario CHAR(36),
    titulo VARCHAR(45),
    descripcion TEXT,
    fechaActividad TIMESTAMP,
    idUsuario CHAR(36),
    eliminado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger BEFORE INSERT: Validar datos antes de insertar
DELIMITER $$
CREATE TRIGGER before_insert_diarios
BEFORE INSERT ON diarios
FOR EACH ROW
BEGIN
    IF NEW.titulo IS NULL OR TRIM(NEW.titulo) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo titulo no puede ser nulo o vacío.';
    END IF;
    IF NEW.fechaActividad IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo fechaActividad no puede ser nulo.';
    END IF;
    IF NEW.idUsuario IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo idUsuario no puede ser nulo.';
    END IF;
END$$
DELIMITER ;

-- Trigger BEFORE UPDATE: Validar datos antes de actualizar
DELIMITER $$
CREATE TRIGGER before_update_diarios
BEFORE UPDATE ON diarios
FOR EACH ROW
BEGIN
    IF NEW.titulo IS NULL OR TRIM(NEW.titulo) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo titulo no puede ser actualizado a un valor nulo o vacío.';
    END IF;
    IF NEW.fechaActividad IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo fechaActividad no puede ser actualizado a un valor nulo.';
    END IF;
END$$
DELIMITER ;

-- Trigger AFTER DELETE: Registrar eliminación en auditoría
DELIMITER $$
CREATE TRIGGER after_delete_diarios
AFTER DELETE ON diarios
FOR EACH ROW
BEGIN
    INSERT INTO diarios_eliminados (idDiario, titulo, descripcion, fechaActividad, idUsuario)
    VALUES (OLD.idDiario, OLD.titulo, OLD.descripcion, OLD.fechaActividad, OLD.idUsuario);
END$$
DELIMITER ;


-- Crear tabla de auditoría para actualizaciones en diarios
CREATE TABLE IF NOT EXISTS diarios_actualizaciones (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idDiario CHAR(36),
    titulo_old VARCHAR(45),
    titulo_new VARCHAR(45),
    descripcion_old TEXT,
    descripcion_new TEXT,
    fechaActividad_old TIMESTAMP NULL,
    fechaActividad_new TIMESTAMP NULL,
    idUsuario_old CHAR(36),
    idUsuario_new CHAR(36),
    actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- Trigger AFTER UPDATE para diarios
DELIMITER $$
CREATE TRIGGER after_update_diarios
AFTER UPDATE ON diarios
FOR EACH ROW
BEGIN
    INSERT INTO diarios_actualizaciones (
        idDiario,
        titulo_old, titulo_new,
        descripcion_old, descripcion_new,
        fechaActividad_old, fechaActividad_new,
        idUsuario_old, idUsuario_new,
        actualizado_en
    )
    VALUES (
        OLD.idDiario,
        OLD.titulo, NEW.titulo,
        OLD.descripcion, NEW.descripcion,
        OLD.fechaActividad, NEW.fechaActividad,
        OLD.idUsuario, NEW.idUsuario,
        CURRENT_TIMESTAMP
    );
END$$
DELIMITER ;

-- Crear tabla de auditoría para actualizaciones en tipos
CREATE TABLE IF NOT EXISTS tipos_eliminados (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idTipo INT,
    tipo VARCHAR(45),
    color VARCHAR(45),
    idUsuario CHAR(36),
    eliminado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$
CREATE TRIGGER after_delete_tipos
AFTER DELETE ON tipos
FOR EACH ROW
BEGIN
    INSERT INTO tipos_eliminados (
        idTipo, tipo, color, idUsuario, eliminado_en
    )
    VALUES (
        OLD.idTipo, OLD.tipo, OLD.color, OLD.idUsuario, CURRENT_TIMESTAMP
    );
END$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER before_insert_tipos
BEFORE INSERT ON tipos
FOR EACH ROW
BEGIN
    IF NEW.tipo IS NULL OR TRIM(NEW.tipo) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo tipo no puede ser nulo o vacío.';
    END IF;
    IF NEW.color IS NULL OR TRIM(NEW.color) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo color no puede ser nulo o vacío.';
    END IF;
    IF NEW.idUsuario IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo idUsuario no puede ser nulo.';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER before_update_tipos
BEFORE UPDATE ON tipos
FOR EACH ROW
BEGIN
    IF NEW.tipo IS NULL OR TRIM(NEW.tipo) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo tipo no puede ser actualizado a un valor nulo o vacío.';
    END IF;
    IF NEW.color IS NULL OR TRIM(NEW.color) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo color no puede ser actualizado a un valor nulo o vacío.';
    END IF;
END$$
DELIMITER ;

CREATE TABLE IF NOT EXISTS tipos_actualizaciones (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idTipo INT,
    tipo_old VARCHAR(45),
    tipo_new VARCHAR(45),
    color_old VARCHAR(45),
    color_new VARCHAR(45),
    idUsuario_old CHAR(36),
    idUsuario_new CHAR(36),
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


DELIMITER $$
CREATE TRIGGER after_update_tipos
AFTER UPDATE ON tipos
FOR EACH ROW
BEGIN
    INSERT INTO tipos_actualizaciones (
        idTipo,
        tipo_old, tipo_new,
        color_old, color_new,
        idUsuario_old, idUsuario_new,
        actualizado_en
    )
    VALUES (
        OLD.idTipo,
        OLD.tipo, NEW.tipo,
        OLD.color, NEW.color,
        OLD.idUsuario, NEW.idUsuario,
        CURRENT_TIMESTAMP
    );
END$$
DELIMITER ;

-- TRIGGERS DE ELIMINADOS

CREATE TABLE IF NOT EXISTS estados_eliminados (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idEstado INT,
    estado VARCHAR(45),
    eliminado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$
CREATE TRIGGER before_insert_estados
BEFORE INSERT ON estados
FOR EACH ROW
BEGIN
    IF NEW.estado IS NULL OR TRIM(NEW.estado) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo estado no puede ser nulo o vacío.';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER before_update_estados
BEFORE UPDATE ON estados
FOR EACH ROW
BEGIN
    IF NEW.estado IS NULL OR TRIM(NEW.estado) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo estado no puede ser actualizado a un valor nulo o vacío.';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER after_delete_estados
AFTER DELETE ON estados
FOR EACH ROW
BEGIN
    INSERT INTO estados_eliminados (
        idEstado, estado, eliminado_en
    )
    VALUES (
        OLD.idEstado, OLD.estado, CURRENT_TIMESTAMP
    );
END$$
DELIMITER ;


CREATE TABLE IF NOT EXISTS estados_actualizaciones (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idEstado INT,
    estado_old VARCHAR(45),
    estado_new VARCHAR(45),
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$
CREATE TRIGGER after_update_estados
AFTER UPDATE ON estados
FOR EACH ROW
BEGIN
    INSERT INTO estados_actualizaciones (
        idEstado, estado_old, estado_new, actualizado_en
    )
    VALUES (
        OLD.idEstado, OLD.estado, NEW.estado, CURRENT_TIMESTAMP
    );
END$$
DELIMITER ;


-- TRIGGERS de tareas
CREATE TABLE IF NOT EXISTS tareas_eliminadas (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idTarea CHAR(36),
    titulo VARCHAR(45),
    descripcion VARCHAR(255),
    fechaActividad TIMESTAMP,
    idEstado INT,
    idTipo INT,
    idUsuario CHAR(36),
    eliminado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$
CREATE TRIGGER before_insert_tareas
BEFORE INSERT ON tareas
FOR EACH ROW
BEGIN
    IF NEW.titulo IS NULL OR TRIM(NEW.titulo) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo titulo no puede ser nulo o vacío.';
    END IF;
    IF NEW.descripcion IS NULL OR TRIM(NEW.descripcion) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo descripcion no puede ser nulo o vacío.';
    END IF;
    IF NEW.idEstado IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo idEstado no puede ser nulo.';
    END IF;
    IF NEW.idTipo IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo idTipo no puede ser nulo.';
    END IF;
    IF NEW.idUsuario IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo idUsuario no puede ser nulo.';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER before_update_tareas
BEFORE UPDATE ON tareas
FOR EACH ROW
BEGIN
    -- Validar que el título no sea nulo o vacío
    IF NEW.titulo IS NULL OR TRIM(NEW.titulo) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo titulo no puede ser actualizado a un valor nulo o vacío.';
    END IF;
    
    -- Validar que la descripción no sea nula o vacía
    IF NEW.descripcion IS NULL OR TRIM(NEW.descripcion) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo descripcion no puede ser actualizado a un valor nulo o vacío.';
    END IF;
    
    -- Validar que idEstado no sea nulo
    IF NEW.idEstado IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo idEstado no puede ser actualizado a un valor nulo.';
    END IF;

    -- Validar que idTipo no sea nulo
    IF NEW.idTipo IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo idTipo no puede ser actualizado a un valor nulo.';
    END IF;

    -- Validar que idUsuario no sea nulo
    IF NEW.idUsuario IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El campo idUsuario no puede ser actualizado a un valor nulo.';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER after_delete_tareas
AFTER DELETE ON tareas
FOR EACH ROW
BEGIN
    INSERT INTO tareas_eliminadas (
        idTarea, titulo, descripcion, fechaActividad, idEstado, idTipo, idUsuario, eliminado_en
    )
    VALUES (
        OLD.idTarea, OLD.titulo, OLD.descripcion, OLD.fechaActividad, OLD.idEstado, OLD.idTipo, OLD.idUsuario, CURRENT_TIMESTAMP
    );
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER after_update_tareas
AFTER UPDATE ON tareas
FOR EACH ROW
BEGIN
    INSERT INTO tareas_actualizaciones (
        idTarea,
        titulo_old, titulo_new,
        descripcion_old, descripcion_new,
        fechaActividad_old, fechaActividad_new,
        idEstado_old, idEstado_new,
        idTipo_old, idTipo_new,
        idUsuario_old, idUsuario_new,
        actualizado_en
    )
    VALUES (
        OLD.idTarea,
        OLD.titulo, NEW.titulo,
        OLD.descripcion, NEW.descripcion,
        OLD.fechaActividad, NEW.fechaActividad,
        OLD.idEstado, NEW.idEstado,
        OLD.idTipo, NEW.idTipo,
        OLD.idUsuario, NEW.idUsuario,
        CURRENT_TIMESTAMP
    );
END$$
DELIMITER ;

-- TRIGGER de amigos
CREATE TABLE IF NOT EXISTS amigos_eliminados (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idPrimerUsuario CHAR(36),
    idSegundoUsuario CHAR(36),
    solicitudAmigoAceptada BOOLEAN,
    eliminado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$
CREATE TRIGGER before_insert_amigos
BEFORE INSERT ON amigos
FOR EACH ROW
BEGIN
    IF NEW.idPrimerUsuario IS NULL OR NEW.idSegundoUsuario IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Los campos idPrimerUsuario y idSegundoUsuario no pueden ser nulos.';
    END IF;
    IF NEW.idPrimerUsuario = NEW.idSegundoUsuario THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Un usuario no puede ser amigo de sí mismo.';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER after_delete_amigos
AFTER DELETE ON amigos
FOR EACH ROW
BEGIN
    INSERT INTO amigos_eliminados (
        idPrimerUsuario, idSegundoUsuario, solicitudAmigoAceptada, eliminado_en
    )
    VALUES (
        OLD.idPrimerUsuario, OLD.idSegundoUsuario, OLD.solicitudAmigoAceptada, CURRENT_TIMESTAMP
    );
END$$
DELIMITER ;

CREATE TABLE IF NOT EXISTS amigos_actualizaciones (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idPrimerUsuario CHAR(36),
    idSegundoUsuario CHAR(36),
    solicitudAmigoAceptada_old BOOLEAN,
    solicitudAmigoAceptada_new BOOLEAN,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$
CREATE TRIGGER after_update_amigos
AFTER UPDATE ON amigos
FOR EACH ROW
BEGIN
    INSERT INTO amigos_actualizaciones (
        idPrimerUsuario, idSegundoUsuario, 
        solicitudAmigoAceptada_old, solicitudAmigoAceptada_new, 
        actualizado_en
    )
    VALUES (
        OLD.idPrimerUsuario, OLD.idSegundoUsuario,
        OLD.solicitudAmigoAceptada, NEW.solicitudAmigoAceptada,
        CURRENT_TIMESTAMP
    );
END$$
DELIMITER ;

-- TRIGGERS de amigos_has_tareas
CREATE TABLE IF NOT EXISTS amigos_has_tareas_eliminados (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idPrimerUsuario CHAR(36),
    idSegundoUsuario CHAR(36),
    idTarea CHAR(36),
    solicitudTareaAceptada BOOLEAN,
    eliminado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$
CREATE TRIGGER before_insert_amigos_has_tareas
BEFORE INSERT ON amigos_has_tareas
FOR EACH ROW
BEGIN
    IF NEW.idPrimerUsuario IS NULL OR NEW.idSegundoUsuario IS NULL OR NEW.idTarea IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Los campos idPrimerUsuario, idSegundoUsuario y idTarea no pueden ser nulos.';
    END IF;

    IF NEW.idPrimerUsuario = NEW.idSegundoUsuario THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Un usuario no puede asignar una tarea a sí mismo.';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER after_delete_amigos_has_tareas
AFTER DELETE ON amigos_has_tareas
FOR EACH ROW
BEGIN
    INSERT INTO amigos_has_tareas_eliminados (
        idPrimerUsuario, idSegundoUsuario, idTarea, solicitudTareaAceptada, eliminado_en
    )
    VALUES (
        OLD.idPrimerUsuario, OLD.idSegundoUsuario, OLD.idTarea, OLD.solicitudTareaAceptada, CURRENT_TIMESTAMP
    );
END$$
DELIMITER ;

CREATE TABLE IF NOT EXISTS amigos_has_tareas_actualizaciones (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idPrimerUsuario CHAR(36),
    idSegundoUsuario CHAR(36),
    idTarea CHAR(36),
    solicitudTareaAceptada_old BOOLEAN,
    solicitudTareaAceptada_new BOOLEAN,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$
CREATE TRIGGER after_update_amigos_has_tareas
AFTER UPDATE ON amigos_has_tareas
FOR EACH ROW
BEGIN
    INSERT INTO amigos_has_tareas_actualizaciones (
        idPrimerUsuario, idSegundoUsuario, idTarea,
        solicitudTareaAceptada_old, solicitudTareaAceptada_new, actualizado_en
    )
    VALUES (
        OLD.idPrimerUsuario, OLD.idSegundoUsuario, OLD.idTarea,
        OLD.solicitudTareaAceptada, NEW.solicitudTareaAceptada, CURRENT_TIMESTAMP
    );
END$$
DELIMITER ;
