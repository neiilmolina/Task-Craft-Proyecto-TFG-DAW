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
    SELECT u.idUsuario, u.nombreUsuario, u.email, u.password, u.urLImagen, r.idRol, r.rol FROM usuarios u INNER JOIN roles r ON u.idRol = r.idRol WHERE nombreUsuario LIKE '%adm%';
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
    -- SELECT DE ESTADOS POR ID (get/:idEstado)
    SELECT * FROM estados WHERE idEstado = 2;
    -- INSERT DE TIPO (post/:)
    INSERT INTO estados (estado) VALUES ('');
    -- DELETE DE ESTADOS(delete/:idEstado)
    DELETE FROM estados WHERE idEstado = 2;
    -- UPDATE DE ESTADOS (put/:idEstado)
    UPDATE estados SET estado = "" WHERE idEstado = 2;
    
-- CONSULTAS DE TAREAS
	-- SELECT DE TODAS LAS TAREAS (get/) 
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
    -- SELECT DE LA TAREA POR ID (get/:idTarea)
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
	ON ta.idUsuario = u.idUsuario 
    WHERE ta.idTarea = "";
    -- SELECT DE LAS TAREAS POR USUARIO (get/:idUsuario)
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
	ON ta.idUsuario = u.idUsuario 
    WHERE ta.idUsuario = "";
	-- SELECT DE LAS TAREAS POR USUARIO Y ESTADO(get/:idUsuario/:idEstado)
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
	ON ta.idUsuario = u.idUsuario 
    WHERE ta.idUsuario = "" AND ta.idEstado = 1;
	-- SELECT DE LAS TAREAS POR USUARIO Y TIPO(get/:idUsuario/:idTipo)
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
	ON ta.idUsuario = u.idUsuario 
    WHERE ta.idUsuario = "" AND ta.idTipo = 1;
    -- INSERT DE UNA TAREA (post/)
    INSERT INTO tareas (idTarea, titulo, descripcion, fechaActividad, idTipo, idUsuario) VALUES ('', '', '', NOW(), 1, ''); 
    -- DELETE DE UNA TAREA (delete/:idUsuario)
    DELETE FROM tareas WHERE idUsuario = "";
    -- UPDATE DE UNA TAREA (put/:idUsuario)
    UPDATE tareas SET titulo = "", descripcion ="", fechaActividad = now() WHERE idUsuario = "";

-- CONSULTAS DE AMIGOS
	-- SELECT DE TODOS LOS AMIGOS (get/)
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
	-- SELECT DE TODOS LOS AMIGOS DE UN USUARIO(get/:idUsuario)
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
	ON a.idSegundoUsuario = u2.idUsuario
	WHERE idPrimerUsuario = "" OR idSegundoUsuario ="";
    -- SELECT DE TODAS LAS SOLICITUDES ENVIADAS DE UN USUARIO (get/:idPrimerUsuario)
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
	ON a.idSegundoUsuario = u2.idUsuario
	WHERE idPrimerUsuario = "" AND a.solicitudAmigoAceptada = FALSE;
    -- SELECT DE TODAS LAS SOLICITUDES RECIBIDAS DE UN USUARIO (get/:idSegundoUsuario)
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
	ON a.idSegundoUsuario = u2.idUsuario
	WHERE a.idSegundoUsuario = "" AND a.solicitudAmigoAceptada = FALSE;
    -- INSERT DE SOLICITUD (post/)
    INSERT INTO amigos (idPrimerUsuario, idSegundoUsuario) VALUES ('', '');
    -- DELETE AMIGOS (delete/:idPrimerUsuario/:idSegundoUsuario)
    DELETE FROM amigos WHERE idPrimerUsuario = '' AND idSegundoUsuario = '';
    -- UPDATE DE SOLICITUD O ACEPTAR SOLICITUD(put/:idPrimerUsuario/:idSegundoUsuario)
	UPDATE amigos SET solicitudAmigoAceptada = TRUE WHERE idPrimerUsuario ="" AND idSegundoUsuario = "";
    
-- CONSULTAS DE AMIGOS_HAS_TAREAS (TAREAS COMPARTIDAS)
	-- SELECT DE TODOS LAS TAREAS COMPARTIDAS(get/)
    SELECT 
    aht.idPrimerUsuario ,
    u1.nombreUsuario AS nombrePrimerUsuario,
    aht.idSegundoUsuario,
    u2.nombreUsuario AS nombreSegundoUsuario,
    aht.solicitudTareaAceptada,
    ta.idTarea,
    u3.nombreUsuario AS creador,
    ta.titulo,
    ta.descripcion,
    ta.fechaActividad,
    e.estado,
    ti.tipo
	FROM
	amigos_has_tareas aht
		INNER JOIN
	usuarios u1 ON aht.idPrimerUsuario = u1.idUsuario
		INNER JOIN
	usuarios u2 ON aht.idSegundoUsuario = u2.idUsuario
		INNER JOIN
	tareas ta ON aht.idTarea = ta.idTarea
		INNER JOIN
	estados e ON ta.idEstado = e.idEstado
		INNER JOIN
	tipos ti ON ta.idTipo = ti.idTipo
		INNER JOIN
	usuarios u3 ON ta.idUsuario = u3.idUsuario;
    -- SELECT DE TODAS LAS TAREAS COMPARTIDAS DE UN USUARIO (get/:idUsuario)
    SELECT 
    aht.idPrimerUsuario ,
    u1.nombreUsuario AS nombrePrimerUsuario,
    aht.idSegundoUsuario,
    u2.nombreUsuario AS nombreSegundoUsuario,
    aht.solicitudTareaAceptada,
    ta.idTarea,
    u3.nombreUsuario AS creador,
    ta.titulo,
    ta.descripcion,
    ta.fechaActividad,
    e.estado,
    ti.tipo
	FROM
	amigos_has_tareas aht
		INNER JOIN
	usuarios u1 ON aht.idPrimerUsuario = u1.idUsuario
		INNER JOIN
	usuarios u2 ON aht.idSegundoUsuario = u2.idUsuario
		INNER JOIN
	tareas ta ON aht.idTarea = ta.idTarea
		INNER JOIN
	estados e ON ta.idEstado = e.idEstado
		INNER JOIN
	tipos ti ON ta.idTipo = ti.idTipo
		INNER JOIN
	usuarios u3 ON ta.idUsuario = u3.idUsuario
    WHERE idSegundoUsuario ="" OR idPrimerUsuario ="";	
	-- SELECT DE TODAS LAS SOLICITUD ENVIADAS DE TAREAS COMPARTIDAS POR UN USUARIO (get/:idPrimerUsuario)
	SELECT 
    aht.idPrimerUsuario ,
    u1.nombreUsuario AS nombrePrimerUsuario,
    aht.idSegundoUsuario,
    u2.nombreUsuario AS nombreSegundoUsuario,
    aht.solicitudTareaAceptada,
    ta.idTarea,
    u3.nombreUsuario AS creador,
    ta.titulo,
    ta.descripcion,
    ta.fechaActividad,
    e.estado,
    ti.tipo
	FROM
	amigos_has_tareas aht
		INNER JOIN
	usuarios u1 ON aht.idPrimerUsuario = u1.idUsuario
		INNER JOIN
	usuarios u2 ON aht.idSegundoUsuario = u2.idUsuario
		INNER JOIN
	tareas ta ON aht.idTarea = ta.idTarea
		INNER JOIN
	estados e ON ta.idEstado = e.idEstado
		INNER JOIN
	tipos ti ON ta.idTipo = ti.idTipo
		INNER JOIN
	usuarios u3 ON ta.idUsuario = u3.idUsuario
    WHERE idPrimerUsuario ="" AND aht.solicitudTareaAceptada = FALSE;	
	-- SELECT DE TODAS LAS SOLICITUD RECIBIDAS DE TAREAS COMPARTIDAS POR UN USUARIO (get/:idSegundoUsuario)
	SELECT 
    aht.idPrimerUsuario ,
    u1.nombreUsuario AS nombrePrimerUsuario,
    aht.idSegundoUsuario,
    u2.nombreUsuario AS nombreSegundoUsuario,
    aht.solicitudTareaAceptada,
    ta.idTarea,
    u3.nombreUsuario AS creador,
    ta.titulo,
    ta.descripcion,
    ta.fechaActividad,
    e.estado,
    ti.tipo
	FROM
	amigos_has_tareas aht
		INNER JOIN
	usuarios u1 ON aht.idPrimerUsuario = u1.idUsuario
		INNER JOIN
	usuarios u2 ON aht.idSegundoUsuario = u2.idUsuario
		INNER JOIN
	tareas ta ON aht.idTarea = ta.idTarea
		INNER JOIN
	estados e ON ta.idEstado = e.idEstado
		INNER JOIN
	tipos ti ON ta.idTipo = ti.idTipo
		INNER JOIN
	usuarios u3 ON ta.idUsuario = u3.idUsuario
    WHERE idSegundoUsuario ="" AND aht.solicitudTareaAceptada = FALSE;	
    -- INSERT DE SOLICITUD (post/)
    INSERT INTO amigos_has_tareas (idPrimerUsuario, idSegundoUsuario, idTarea) VALUES ('b6acb1ec-cea8-11ef-a47b-a85e45600cdd', 'b6acb358-cea8-11ef-a47b-a85e45600cdd', 'a9893b08-cf6f-11ef-9f16-a85e45600cdd');
	-- DELETE AMIGOS (delete/:idPrimerUsuario/:idSegundoUsuario)
    DELETE FROM amigos_has_tareas WHERE idPrimerUsuario = '' AND idSegundoUsuario = '';
    -- UPDATE DE SOLICITUD O ACEPTAR SOLICITUD(put/:idPrimerUsuario/:idSegundoUsuario)
	UPDATE amigos_has_tareas SET solicitudTareaAceptada = TRUE WHERE idPrimerUsuario ="" AND idSegundoUsuario = "";