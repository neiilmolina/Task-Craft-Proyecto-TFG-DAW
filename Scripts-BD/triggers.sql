-- TRIGGERS
use proyecto_tfg_daw;

-- Crear tabla de auditoría para registrar eliminaciones
CREATE TABLE IF NOT EXISTS roles_auditoria (
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
    INSERT INTO roles_auditoria (idRol, rol)
    VALUES (OLD.idRol, OLD.rol);
END$$
DELIMITER ;

-- Crear tabla de auditoría para registrar eliminaciones
CREATE TABLE IF NOT EXISTS usuarios_auditoria (
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
    INSERT INTO usuarios_auditoria (idUsuario, nombreUsuario, email)
    VALUES (OLD.idUsuario, OLD.nombreUsuario, OLD.email);
END$$
DELIMITER ;

-- Crear tabla de auditoría para registrar eliminaciones
CREATE TABLE IF NOT EXISTS diarios_auditoria (
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
    INSERT INTO diarios_auditoria (idDiario, titulo, descripcion, fechaActividad, idUsuario)
    VALUES (OLD.idDiario, OLD.titulo, OLD.descripcion, OLD.fechaActividad, OLD.idUsuario);
END$$
DELIMITER ;

-- Crear tabla de auditoría para registrar actualizaciones
CREATE TABLE IF NOT EXISTS diarios_actualizaciones (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idDiario CHAR(36),
    titulo_old VARCHAR(45),
    titulo_new VARCHAR(45),
    descripcion_old TEXT,
    descripcion_new TEXT,
    fechaActividad_old TIMESTAMP,
    fechaActividad_new TIMESTAMP,
    idUsuario_old CHAR(36),
    idUsuario_new CHAR(36),
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger AFTER UPDATE: Registrar actualizaciones
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
        idUsuario_old, idUsuario_new
    )
    VALUES (
        OLD.idDiario, 
        OLD.titulo, NEW.titulo, 
        OLD.descripcion, NEW.descripcion, 
        OLD.fechaActividad, NEW.fechaActividad, 
        OLD.idUsuario, NEW.idUsuario
    );
END$$
DELIMITER ;