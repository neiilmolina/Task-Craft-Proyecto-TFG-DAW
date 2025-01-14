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
	-- SELECT DE TODOS LOS USUARIOS
    SELECT * FROM usuarios;
    -- SELECT DE USUARIO POR ID
    SELECT * FROM usuarios WHERE idUsuario = 'b6acb1ec-cea8-11ef-a47b-a85e45600cdd';
    -- SELECT DE USUARIOS POR IDROL
    SELECT * FROM usuarios u INNER JOIN roles r ON u.idRol = r.idRol WHERE u.idRol = 2;
    -- SELECT DE USUARIO POR ROL
    SELECT * FROM usuarios u INNER JOIN roles r ON u.idRol = r.idRol WHERE r.rol = 'admin';
    -- SELECT DE USUARIOS POR NOMBRE
    SELECT * FROM usuarios WHERE nombreUsuario = 'admin';
    -- SELECT DE USUARIOS POR EMAIL
    SELECT * FROM usuarios WHERE email = 'admin@example.com';
    
    