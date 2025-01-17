-- CONSULTAS DE ROLES
	-- SELECT DE ROLES (get/)
	SELECT * FROM roles;
    -- SELECT POR ID (get/:idRol)
    SELECT * FROM roles WHERE idRol = 1;
    -- SELECT POR ROL (get/:rol)
    SELECT * FROM roles WHERE rol = 'admin';
    -- INSERT DE ROLES (post/:)
    INSERT INTO roles (rol) VALUES ("");
    -- DELETE DE ROLES (delete/:idRol)
    DELETE FROM roles WHERE idRol = 4;
    -- UPDATE DE ROLES (put/:idRol)
    UPDATE roles SET rol = 'pepe' WHERE idRol = 3;

-- CONSULTAS DE USUARIOS
	-- SELECT DE TODOS LOS USUARIOS (get/)
    SELECT u.idUsuario, u.nombreUsuario, u.email, u.password, u.urLImagen, r.idRol, r.rol FROM usuarios u INNER JOIN roles r ON u.idRol = r.idRol;
    -- SELECT DE USUARIO POR ID (get/:idUsuario)
    SELECT u.idUsuario, u.nombreUsuario, u.email, u.password, u.urLImagen, r.idRol, r.rol FROM usuarios u INNER JOIN roles r ON u.idRol = r.idRol WHERE idUsuario = 'b6acb1ec-cea8-11ef-a47b-a85e45600cdd';
    -- SELECT DE USUARIOS POR IDROL (get/:idRol)
    SELECT u.idUsuario, u.nombreUsuario, u.email, u.password, u.urLImagen, r.idRol, r.rol FROM usuarios u INNER JOIN roles r ON u.idRol = r.idRol WHERE u.idRol = 2;
    -- SELECT DE USUARIO POR ROL (get/:rol)
    SELECT u.idUsuario, u.nombreUsuario, u.email, u.password, u.urLImagen, r.idRol, r.rol FROM usuarios u INNER JOIN roles r ON u.idRol = r.idRol WHERE r.rol = 'admin';
    -- SELECT DE USUARIOS POR NOMBRE (get/:nombreUsuario)
    SELECT u.idUsuario, u.nombreUsuario, u.email, u.password, u.urLImagen, r.idRol, r.rol FROM usuarios u INNER JOIN roles r ON u.idRol = r.idRol WHERE nombreUsuario = 'admin';
    -- SELECT DE USUARIOS POR EMAIL (get/:email)
    SELECT u.idUsuario, u.nombreUsuario, u.email, u.password, u.urLImagen, r.idRol, r.rol FROM usuarios u INNER JOIN roles r ON u.idRol = r.idRol WHERE email = 'admin@example.com';
    -- INSERT DE USUARIOS (post/)
    INSERT INTO usuarios (idUsuario, nombreUsuario, email, password, urlImagen) VALUES ('b6acb1ec-cea8-11ef-a47b-a85e45600cdd', 'admin', 'admin@example.com', SHA2('adminpass789', 256), 'http://example.com/admin1.jpg');
    -- DELETE DE USUARIOS (delete/:idUsuario)
    DELETE FROM usuarios WHERE idUsuario = "";
    -- UPDATE DE USUARIOS (put/:idUsuario)
    UPDATE usuarios SET nombreUsuario = "", email = "", password ="", urlImagen = "" WHERE idUsuario = "";
    
-- CONSULTAS DE DIARIOS
	-- SELECT DE TODOS LOS DIARIOS (get/)
    SELECT d.idDiario, d.titulo, d.descripcion, d.fechaActividad, u.nombreUsuario FROM diarios d INNER JOIN usuarios u ON d.idUsuario = u.idUsuario;
	-- SELECT DE DIARIO POR ID(get/:idDiario)
    SELECT d.idDiario, d.titulo, d.descripcion, d.fechaActividad FROM diarios d WHERE d.idDiario = "";
    -- SELECT DE DIARIOS POR IDUSUARIO (get/:idUsuario)
    SELECT d.idDiario, d.titulo, d.descripcion, d.fechaActividad FROM diarios d INNER JOIN usuarios u ON d.idUsuario = u.idUsuario WHERE u.idUsuario = "";
    -- INSERT DE DIARIOS (post/)
    INSERT INTO diarios (idDiario, titulo, descripcion, idUsuario) VALUES (UUID(), '', '', '');
    -- DELETE DE DIARIOS (delete/:idDiario)
    DELETE FROM diarios WHERE idDiario ="";
    -- UPDATE DE DIARIOS (put/:idDiario)
    UPDATE diarios SET titulo = "", descripcion = "" WHERE idDiario = "";
    
-- CONSULTAS DE TIPOS
	-- SELECT DE TODOS LOS TIPOS (get/)
    SELECT t.idTipo, t.tipo, t.color, u.nombreUsuario FROM tipos t INNER JOIN usuarios u ON t.idUsuario = u.idUsuario;
    -- SELECT DE TIPO POR ID (get/:idTipo)
    SELECT t.idTipo, t.tipo, t.color FROM tipos t WHERE t.idTipo = 2;
    -- SELECT DE TIPO POR IDUSUARIO (get/:idUsuario)
    SELECT t.idTipo, t.tipo, t.color, u.nombreUsuario FROM tipos t INNER JOIN usuarios u ON t.idUsuario = u.idUsuario WHERE u.idUsuario = "";
    -- INSERT DE TIPO (post/:)
    INSERT INTO tipos (tipo, color, idUsuario) VALUES ('', '', '');
    -- DELETE DE TIPOS (delete/:idTipo)
    DELETE FROM tipos WHERE idTipo = 2;
    -- UPDATE DE TIPOS (put/:idTipo)
	UPDATE tipos SET tipo = "" , color ="" WHERE idTipo ="";

-- CONSULTAS DE ESTADOS
	-- SELECT DE TODOS LOS ESTADOS (get/)
	SELECT * FROM estados;
    -- SELECT DE ESTADOS POR ID (get/idEstado)
    SELECT * FROM estados WHERE idEstado = 2;
    -- INSERT DE TIPO (post/:)
    INSERT INTO estados (estado) VALUES ('');
    -- DELETE DE ESTADOS(delete/:idEstado)
    DELETE FROM estados WHERE idEstado = 2;
    -- UPDATE DE ESTADOS (put/:idEstado)
    UPDATE estados SET estado = "" WHERE idEstado = 2;
    
-- CONSULTAS DE TAREAS