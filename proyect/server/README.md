# Server - Task Craft Management API

Este es el servidor de la aplicación de Task Craft. Está construido utilizando **Node.js**, **Express**, **TypeScript** y **Supabase** como base de datos. Esta API ofrece funcionalidades para gestionar tareas, objetivos, y proporciona una interfaz para interactuar con la base de datos.

## Tecnologías utilizadas

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express**: Framework minimalista para crear APIs RESTful.
- **TypeScript**: Superset de JavaScript que agrega tipado estático.
- **Supabase**: Plataforma backend como servicio que utiliza PostgreSQL.
- **Zod**: Librería para validación de esquemas de datos.
- **Jest**: Framework para realizar pruebas unitarias e integración.
- **Supertest**: Utilizado para pruebas de integración con la API.

## Instalación

Sigue estos pasos para instalar y ejecutar el servidor en tu entorno local.

1. Clona este repositorio:

   ```bash
   git clone <URL_del_repositorio>
   cd <nombre_del_repositorio>

   ```

2. Instala las dependencias:

   ```bash
    npm install

   ```

3. Crea un archivo .env con tus variables de entorno. Ejemplo:

   ```bash
    SUPABASE_URL=<tu_url_de_supabase>
    SERVICE_ROLE_KEY=<tu_clave_de_supabase>
    PORT=<puerto_para_el_servidor>
    MYSQL_HOST = <host_de_la_bd_mysql>
    MYSQL_USER = <usuario_de_la_bd_mysql>
    MYSQL_PASSWORD = <contraseña_de_la_bd_mysql>
    MYSQL_DATABASE = <nombre_de_la_bd_mysql>
   ```

## Scripts

El archivo package.json incluye los siguientes scripts:

- **`build`**: Compila el código TypeScript a JavaScript.

  ```bash
  npm run build

  ```

- **`start`**: Inicia el servidor en producción utilizando el código JavaScript compilado.

  ```bash
  npm start

  ```

- **`dev`**: Inicia el servidor en modo desarrollo, utilizando nodemon para reiniciar el servidor automáticamente al hacer cambios en los archivos TypeScript.

  ```bash
  npm run dev
  ```

- **`prod`**: Compila el código TypeScript y luego inicia el servidor en producción.

  ```bash
  npm run prod
  ```

- **`test`**: Ejecuta las pruebas-

  ```bash
  npm test
  ```

## Variables de Entorno

Este proyecto utiliza el archivo .env para manejar las variables de entorno. Asegúrate de definir las siguientes variables en tu archivo .env:

- **`SUPABASE_URL`**: URL de tu instancia de Supabase.
- **`SERVICE_ROLE_KEY`**: Clave de tu instancia de Supabase.
- **`PORT`**: Puerto en el que escucha el Servidor

## Estructura del Proyecto

La estructura básica de los archivos es la siguiente:

/server  
├── /src  
│ ├── /estados # Módulo de Estados  
│ │ ├── /dao # Data Access Objects (DAO)  
│ │ │ ├── IEstadosDAO.ts # Interfaz para DAO  
│ │ │ ├── EstadosMysqlDAO.ts # Implementación con MySQL  
│ │ ├── EstadosController.ts # Controlador de Estados  
│ │ ├── EstadosModel.ts # Modelo de Estados  
│ │ ├── interfacesEstados.ts # Definición de interfaces  
│ │ ├── routesEstados.ts # Definición de rutas  
│ │ ├── schemasEstados.ts # Esquemas de validación  
│ ├── /roles # Módulo de Roles  
│ │ ├── /dao # Data Access Objects (DAO)  
│ │ │ ├── IRolesDAO.ts # Interfaz para DAO  
│ │ │ ├── RolesMysqlDAO.ts # Implementación con MySQL  
│ │ ├── RolesController.ts # Controlador de Roles  
│ │ ├── RolesModel.ts # Modelo de Roles  
│ │ ├── interfacesRoles.ts # Definición de interfaces  
│ │ ├── routesRoles.ts # Definición de rutas  
│ │ ├── schemasRoles.ts # Esquemas de validación  
│ ├── /tipos # Módulo de Tipos  
│ │ ├── /dao # Data Access Objects (DAO)  
│ │ │ ├── interfacesTipos.ts # Definición de interfaces  
│ │ ├── TiposController.ts # Controlador de Tipos  
│ │ ├── TiposModel.ts # Modelo de Tipos  
│ │ ├── routesTipos.ts # Definición de rutas  
│ │ ├── schemasTipos.ts # Esquemas de validación  
│ ├── /usuarios # Módulo de Usuarios  
│ │ ├── /dao # Data Access Objects (DAO)  
│ │ │ ├── IUsuariosDAO.ts # Interfaz para DAO  
│ │ │ ├── UsuariosMysqlDAO.ts # Implementación con MySQL  
│ │ ├── UsuariosController.ts # Controlador de Usuarios  
│ │ ├── UsuariosModel.ts # Modelo de Usuarios  
│ │ ├── interfacesUsuarios.ts # Definición de interfaces  
│ │ ├── routesUsuarios.ts # Definición de rutas  
│ │ ├── schemasUsuarios.ts # Esquemas de validación  
│ ├── /config  
│ │ └── mysql.ts # Configuración de conexión a MySQL  
│ ├── app.ts # Configuración principal de Express  
├── /tests  
│ ├── /mocks # Carpeta para mocks en testing  
│ ├── /estados # Tests del módulo Estados  
│ │ ├── EstadosController.test.ts # Pruebas del controlador de Estados  
│ │ ├── EstadosModel.test.ts # Pruebas del modelo de Estados  
│ │ ├── routesEstados.test.ts # Pruebas de rutas de Estados  
│ ├── /usuarios # Tests del módulo Usuarios  
│ │ ├── UsuariosMysqlDAO.test.ts # Pruebas del DAO de Usuarios  
│ │ ├── routesUsuarios.test.ts # Pruebas de rutas de Usuarios  
│ ├── /roles # Tests del módulo Roles  
│ │ ├── RolesMysqlDAO.test.ts # Pruebas del DAO de roles  
│ │ ├── routesRoles.test.ts # Pruebas de rutas de roles  
├── server.ts # Punto de entrada del servidor  
├── tsconfig.json # Configuración de TypeScript  
├── package.json # Dependencias y scripts  
└── .env # Variables de entorno

### Patrones de Diseño Utilizados

#### 1. Patrón DAO (Data Access Object)

- Separa la lógica de acceso a datos
- Permite cambiar la implementación de la base de datos
- Facilita las pruebas unitarias

#### 2. Patrón MVC (Model-View-Controller)

- Modelo: EstadosModel
- Controlador: EstadosController
- Vista: API REST

#### 3. Inyección de Dependencias

- Los componentes reciben sus dependencias en el constructor
- Facilita el testing y la modularidad

### Configuración del Servidor

El archivo server-supabase.ts inicializa la aplicación:

```typescript
/**
 * Inicialización del servidor con DAOs basados en MySQL.
 *
 * Se crean instancias de los DAOs para cada módulo y se pasan a la aplicación.
 */

import createApp from "@/src/app";
import EstadosMysqlDAO from "@/src/estados/dao/EstadosMysqlDAO";
import TiposMysqlDAO from "@/src/tipos/dao/TiposMysqlDAO";
import RolesMysqlDAO from "@/src/roles/dao/RolesMysqlDAO";

// Creación de instancias de los DAOs con MySQL
const estadosMysqlDAO = new EstadosMysqlDAO();
const tiposMysqlDAO = new TiposMysqlDAO();
const rolesMysqlDAO = new RolesMysqlDAO();

// Inicialización de la aplicación con los DAOs
createApp(estadosMysqlDAO, tiposMysqlDAO, rolesMysqlDAO);
```

### Descripción de Componentes

### Estados

##### 1. EstadosController.ts

Maneja las peticiones HTTP y la lógica de control.

```typescript
class EstadosController {
  constructor(private estadosModel: EstadosModel) {}

  // Métodos principales:
  getEstados: RequestHandler; // GET /estados
  getEstadoById: RequestHandler; // GET /estados/:idEstado
  createEstado: RequestHandler; // POST /estados
  updateEstado: RequestHandler; // PUT /estados/:idEstado
  deleteEstado: RequestHandler; // DELETE /estados/:idEstado
}
```

##### 2. EstadosModel.ts

Implementa la lógica de negocio y maneja las operaciones con la base de datos.

```typescript
class EstadosModel {
  constructor(private estadosDAO: IEstadosDAO) {}

  // Métodos principales:
  async getAll(): Promise<Estado[]>;
  async getById(id: number): Promise<Estado | null>;
  async create(estado: EstadoNoId): Promise<Estado | null>;
  async update(id: number, estado: EstadoNoId): Promise<Estado | null>;
  async delete(id: number): Promise<boolean>;
}
```

##### 3. IEstadosDAO.ts

Implementa el acceso a datos utilizando MySQL.

```typescript
class EstadosMysqlDAO implements IEstadosDAO {
  // Métodos de acceso a datos:
  async getAll(): Promise<Estado[]>;
  async getById(id: number): Promise<Estado | null>;
  async create(estado: EstadoNoId): Promise<Estado | null>;
  async update(id: number, estadoData: EstadoNoId): Promise<Estado | null>;
  async delete(id: number): Promise<boolean>;
}
```

##### 4. Interfaces y Tipos

```typescript
// interfacesEstados.ts
interface Estado {
  idEstado: number;
  estado: string;
}

interface EstadoNoId {
  estado: string;
}
```

##### 5. Pruebas Unitarias y de Integración

##### - EstadosMysqlDAO.test.ts

Pruebas unitarias para la conexión con Supabase:

```ts
// No se crearon
describe("EstadosMysql", () => {
  let estadosDAO: EstadosMysql;
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all estados");
    it("should return an empty array if an error occurs");
  });

  describe("getById", () => {
    it("should return a estado by id");
    it("should return null if an error occurs");
  });

  describe("create", () => {
    it("should create a new estado");
    it("should return null if an error occurs");
  });

  describe("update", () => {
    it("should update an existing estado");
    it("should return null if an error occurs");
  });

  describe("delete", () => {
    it("should delete an existing estado");
    it("should return false if an error occurs");
  });
});
```

##### - EstadosModel.test.ts

```ts
describe("EstadosModel", () => {
  let estadosModel: EstadosModel;
  let mockDAO: jest.Mocked<IEstadosDAO>;

  beforeEach(() => {
    // Create a mock implementation of IEstadosDAO
    mockDAO = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IEstadosDAO>;

    // Initialize the model with the mock DAO
    estadosModel = new EstadosModel(mockDAO);

    describe("getAll", () => {
      it("debería obtener una lista de todos los estados");
      it("debería devolver una lista vacía cuando no hay estados");
      it("debería manejar errores en la consulta");
    });
  });

  describe("getById", () => {
    it("debería obtener un estado por su ID");
    it("debería devolver null cuando el estado no existe");
    it("debería manejar errores en la consulta");
  });

  describe("create", () => {
    it("debería crear un nuevo estado correctamente");
    it("debería devolver null cuando falla la creación");
    it("debería manejar errores en la creación");
  });

  describe("update", () => {
    it("debería actualizar un estado correctamente");
    it("debería devolver null cuando el estado a actualizar no existe");
    it("debería manejar errores en la actualización");
  });

  describe("delete", () => {
    it("debería eliminar un estado correctamente");
    it("debería devolver false cuando el estado a eliminar no existe");
    it("debería manejar errores en la eliminación");
  });
});
```

##### - EstadosController.test.ts

Pruebas unitarias para el controlador:

```typescript
describe("EstadosController", () => {
  // Configuración inicial
  let controller: EstadosController;
  let mockModel: jest.Mocked<EstadosModel>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    // Configuración de mocks para cada prueba
  });

  describe("getEstados", () => {
    it("debería devolver todos los estados con status 200");
    it("debería manejar errores y devolver status 500");
  });

  describe("getEstadoById", () => {
    it("debería devolver un estado específico con status 200");
    it("debería devolver 404 cuando el estado no existe");
    it("debería manejar errores de parsing de ID");
  });

  describe("createEstado", () => {
    it("debería crear un estado y devolver status 201");
    it("debería validar los datos de entrada");
    it("debería manejar errores de validación");
  });

  describe("updateEstado", () => {
    it("debería actualizar un estado existente");
    it("debería devolver 404 para estados no existentes");
    it("debería validar los datos de actualización");
  });

  describe("deleteEstado", () => {
    it("debería eliminar un estado existente");
    it("debería devolver 404 para estados no existentes");
    it("debería manejar errores en la eliminación");
  });
});
```

##### - routeEstados.test.ts

Pruebas de integración para las rutas:

```typescript
describe("Estados Routes", () => {
  let app: express.Application;
  let mockEstadosModel: any;

  beforeEach(() => {
    mockEstadosModel = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    app = express();
    app.use(express.json());
    app.use("/estados", createEstadosRoute(mockEstadosModel));
  });

  describe("GET /estados", () => {
    it("debería devolver todos los estados");
    it("debería manejar errores del servidor");
  });

  describe("GET /estados/:id", () => {
    it("debería devolver un estado específico");
    it("debería devolver 404 para ID no existente");
  });

  describe("POST /estados", () => {
    it("debería crear un nuevo estado");
    it("debería validar los datos de entrada");
    it("debería manejar errores de validación");
  });

  describe("PUT /estados/:id", () => {
    it("debería actualizar un estado existente");
    it("debería validar los datos de actualización");
    it("debería devolver 404 para ID no existente");
  });

  describe("DELETE /estados/:id", () => {
    it("debería eliminar un estado existente");
    it("debería devolver 404 para ID no existente");
  });
});
```

### Roles

##### 1. RolesController.ts

Maneja las peticiones HTTP y la lógica de control.

```typescript
class RolesController {
  constructor(private RolesModel: RolesModel) {}

  // Métodos principales:
  getRoles: RequestHandler; // GET /Roles
  getEstadoById: RequestHandler; // GET /Roles/:idRol
  createEstado: RequestHandler; // POST /Roles
  updateEstado: RequestHandler; // PUT /Roles/:idRol
  deleteEstado: RequestHandler; // DELETE /Roles/:idRol
}
```

##### 2. RolesModel.ts

Implementa la lógica de negocio y maneja las operaciones con la base de datos.

```typescript
class RolesModel {
  constructor(private RolesDAO: IRolesDAO) {}

  // Métodos principales:
  async getAll(): Promise<Rol[]>;
  async getById(id: number): Promise<Rol | null>;
  async create(rol: RolNoId): Promise<Rol | null>;
  async update(id: number, rol: RolNoId): Promise<Rol | null>;
  async delete(id: number): Promise<boolean>;
}
```

##### 3. IRolesDAO.ts

Implementa el acceso a datos utilizando MySQL.

```typescript
class RolesMysqlDAO implements IRolesDAO {
  getAll(): Promise<Rol[]>;
  getById(id: number): Promise<Rol | null>;
  create(role: RolNoId): Promise<Rol | null>;
  update(id: number, role: RolNoId): Promise<Rol | null>;
  delete(id: number): Promise<boolean>;
}
```

##### 4. Interfaces y Tipos

```typescript
// interfacesEstados.ts
interface Rol {
  idRol: number;
  rol: string;
}

interface RolNoId {
  rol: string;
}
```

##### 5. Pruebas Unitarias y de Integración

##### - EstadosMysqlDAO.test.ts

Pruebas unitarias para la conexión con Supabase:

```ts
// No se crearon
describe("RolesMysqlDAO", () => {
  let rolesDAO: RolesMysqlDAO;
  beforeEach(() => {
    // Configura la instancia de RolesMysqlDAO antes de cada test
    rolesDAO = new RolesMysqlDAO();

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("RolesMysqlDAO - getAll", () => {
    it("should return an array of roles when query is successful");
    it("should throw an error if query fails");
    it("should throw an error if results are not an array");
  });

  describe("RolesMysqlDAO - getById", () => {
    it("should return a role when a valid ID is provided");
    it("should return null when no role is found");
    it("should throw an error if database query fails");
  });

  describe("RolesMysqlDAO - create", () => {
    it("should successfully create a new role");
    it("should throw an error if database query fails");
  });

  describe("RolesMysqlDAO - update", () => {
    it("should successfully update an existing role");
    it("should throw an error if role is not found");
    it("should throw an error if database query fails");
  });

  describe("RolesMysqlDAO - delete", () => {
    it("should return true when the role is successfully deleted");
    it("should throw an error if role is not found");
    it("should throw an error if database query fails");
  });
});
```

##### - routeEstados.test.ts

Pruebas de integración para las rutas:

```typescript
describe("Roles Routes", () => {
  let app: express.Application;
  let mockRolesModel: jest.Mocked<RolesModel>;

  beforeEach(() => {
    mockRolesModel = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<RolesModel>;

    app = express();
    app.use(express.json());
    app.use("/roles", createRolesRoute(mockRolesModel));
  });

  describe("RolesMysqlDAO - getAll", () => {
    it("should return an array of roles when query is successful");
    it("should throw an error if query fails");
    it("should throw an error if results are not an array");
  });

  describe("RolesMysqlDAO - getById", () => {
    it("should return a role when a valid ID is provided");
    it("should return null when no role is found");
    it("should throw an error if database query fails");
  });

  describe("RolesMysqlDAO - create", () => {
    it("should successfully create a new role");
    it("should throw an error if database query fails");
  });

  describe("RolesMysqlDAO - update", () => {
    it("should successfully update an existing role");
    it("should throw an error if role is not found");
    it("should throw an error if database query fails");
  });

  describe("RolesMysqlDAO - delete", () => {
    it("should return true when the role is successfully deleted");
    it("should throw an error if role is not found");
    it("should throw an error if database query fails");
  });
});
```

### Usuarios

#### 1. UsuariosController.ts

Maneja las peticiones HTTP y la lógica de control.

```ts
class UsuariosController {
  constructor(private usuariosModel: UsuariosModel) {}
}
```

#### 2. UsuariosModel.ts

Implementa la lógica de negocio y maneja las operaciones con la base de datos.

```ts
class UsuariosModel {
  constructor(private usuariosDAO: IUsuariosDAO) {}
}
```

#### 3. UsuariosDAO.ts

Implementa el acceso a datos, interactuando con la base de datos.

```ts
interface IUsuariosDAO {}
```

#### 4. Interfaces y Tipos

```typescript
import { Rol } from "@/src/roles/interfacesRoles";

export interface UsuarioBD {
  idUsuario: string;
  nombreUsuario: string;
  email: string;
  password: string; // Incluimos el campo password ya que estaba en el objeto
  urlImagen: string | null; // Se permite null para la URL de la imagen
  idRol: number; // Asumiendo que el idRol es un número
  rol?: string;
}

export interface Usuario {
  idUsuario: string;
  nombreUsuario: string;
  email: string;
  urlImg: string | null;
  rol: Rol;
}

export interface UsuarioCreate {
  idUsuario: string;
  nombreUsuario?: string;
  email: string;
  password: string;
  urlImg?: string | null;
  idRol?: number;
}

export interface UsuarioUpdate {
  nombreUsuario: string;
  email?: string;
  password?: string;
  urlImg?: string | null;
  idRol?: number;
}

export interface UsuarioReturn {
  idUsuario: string;
  nombreUsuario?: string;
  email: string;
  urlImg?: string | null;
  idRol: number;
}
```

#### 5. Pruebas Unitarias y de Integración

##### - UsuariosMysqlDAO.test.ts

Pruebas unitarias para la conexión con Supabase:

```ts
describe("UsuariosMysqlDAO", () => {
  let usuariosDAO: UsuariosMysqlDAO;

  beforeEach(() => {
    usuariosDAO = new UsuariosMysqlDAO();

    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("getAll", () => {
    it("should return an array of users when query is successful");
    it("should throw an error if query fails");
    it("should throw an error if results are not an array");
    it("should return an empty array if no users are found");
    it("should handle filtering users by idRol");
  });

  describe("getById", () => {
    it("should return a user when a valid ID is provided");
    it("should return null when no user is found");
    it("should throw an error if database query fails");
  });

  describe("UsuariosMysqlDAO - create", () => {
    it("should successfully create a new user");
    it("should throw an error if database query fails");
  });

  describe("UsuariosMysqlDAO - update", () => {
    it("should successfully update an existing user");
    it("should throw an error if user is not found");
    it("should throw an error if database query fails");
  });

  describe("UsuariosMysqlDAO - delete", () => {
    it("should return true when the user is successfully deleted");
    it("should throw an error if user is not found");
    it("should throw an error if database query fails");
  });
});
```

##### - routesUsers.test.ts

Pruebas de integración para las rutas:

```ts
describe("UsuariosMysqlDAO", () => {
  let app: Express;
  let mockTiposModel: jest.Mocked<IUsersDAO>;

  beforeEach(() => {
    // Configuración del servidor de pruebas
  });

  describe("GET /users", () => {
    it("debe devolver un array de users cuando la base de datos tiene datos");
    it("debe devolver un array vacío cuando la base de datos no tiene datos");
    it("debe devolver un error 500 si falla la obtención de datos");
    it("debe filtrar users por idRol cuando se proporciona un id válido");
  });

  describe("GET /users/:idUser", () => {
    it("debe devolver un user cuando el idUser existe");
    it("debe devolver un error 404 cuando el idUser no existe");
    it("debe devolver un error 500 si ocurre un fallo en la base de datos");
    it("debe manejar correctamente un idUser inválido (NaN)");
  });

  describe("POST /validateUser", () => {
    it("debe devolver un user cuando las credenciales son correctas");
    it("debe devolver un error 404 si el user no existe");
    it("debe devolver un error 500 si ocurre un fallo en el controlador");
    it("debe devolver un error 400 si los datos de entrada no son válidos");
  });

  describe("UsuariosMysqlDAO - update", () => {
    it("should successfully update an existing user");
    it("should throw an error if user is not found");
    it("should throw an error if database query fails");
  });

  describe("UsuariosMysqlDAO - delete", () => {
    it("should return true when the user is successfully deleted");
    it("should throw an error if user is not found");
    it("should throw an error if database query fails");
  });
});
```

### Tipos

##### 1. TiposController.ts

Maneja las peticiones HTTP y la lógica de control.

```typescript
class TiposController {
  constructor(private tiposModel: TiposModel) {}

  // Métodos principales:
  getTipos: RequestHandler; // GET /tipos
  getTipoById: RequestHandler; // GET /tipos/:idTipo
  createTipo: RequestHandler; // POST /tipos
  updateTipo: RequestHandler; // PUT /tipos/:idTipo
  deleteTipo: RequestHandler; // DELETE /tipos/:idTipo
}
```

##### 2. TiposModel.ts

Implementa la lógica de negocio y maneja las operaciones con la base de datos.

```typescript
class TiposModel {
  constructor(private tiposDAO: ITiposDAO) {}
  // Métodos principales:

  getAll(idUsuario?: string, userDetails?: boolean): Promise<Tipo[] | null>;
  getById(idTipo: number, userDetails?: boolean): Promise<Tipo | null>;
  create(tipo: TipoCreate): Promise<Tipo | null>;
  update(idTipo: number, tipo: TipoUpdate): Promise<Tipo | null>;
  delete(idTipo: number): Promise<boolean>;
}
```

##### 3. TiposSupabaseDAO.ts

Implementa el acceso a datos utilizando Supabase.

```typescript
class EstadosSupabaseDAO implements IEstadosDAO {
  // Métodos de acceso a datos:
  getAll(idUsuario?: string, userDetails?: boolean): Promise<Tipo[] | null>;
  getById(idTipo: number, userDetails?: boolean): Promise<Tipo | null>;
  create(tipo: TipoCreate): Promise<Tipo | null>;
  update(idTipo: number, tipo: TipoUpdate): Promise<Tipo | null>;
  delete(idTipo: number): Promise<boolean>;
}
```

##### 4. Interfaces y Tipos

```typescript
interface Tipo {
  idTipo: number;
  tipo: string;
  color: string;
  idUsuario: string;
  userDetails?: User;
}

interface TipoCreate {
  tipo: string;
  color: string;
  idUsuario: string;
}

interface TipoNoId {
  tipo: string;
  color: string;
  idUsuario: string;
  userDetails?: User;
}

interface TipoUpdate {
  tipo: string;
  color: string;
  idUsuario?: string;
}
```

##### 5. Pruebas Unitarias y de Integración

##### - TiposSupabaseDAO.test.ts

Pruebas unitarias para la conexión con Supabase:

```ts
describe("TiposSupabaseDAO", () => {
  const tiposDAO: TiposSupabaseDAO;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("getAll", () => {
    it("should return all tipos");
    it("should return all tipos with idUsuario = 1");
    it("should return an empty array if an error occurs");
  });

  describe("getAll with userDetails = true", () => {
    it("should return tipos with user details when userDetails is true");
    it(
      "should return tipos with user details and idUsuario = 1 when userDetails is true"
    );
  });

  describe("getById", () => {
    it("should return a tipo by id");
    it("should return null if an error occurs");
  });
  describe("getById with userDetails = true", () => {
    it("should return a tipo by id with user details");
    it("should return null if an error occurs");
  });

  describe("create", () => {
    it("should create a new tipo");
    it("should return null if an error occurs");
  });

  describe("update", () => {
    it("should update an existing tipo");
    it("should return null if an error occurs");
  });

  describe("delete", () => {
    it("should delete an existing tipo");
    it("should return false if an error occurs");
  });
});
```

##### - routeTipos.test.ts

Pruebas de integración para las rutas:

```typescript
describe("Tipos Routes", () => {
  let app: Express;
  let mockTiposModel: jest.Mocked<TiposModel>;

  beforeEach(() => {
    // Configuración del servidor de pruebas
  });

  describe("GET /tipos", () => {
    it("debe devolver un array de tipos cuando la base de datos tiene datos");
    it("debe devolver un array vacío cuando la base de datos no tiene datos");
    it("debe devolver un error 500 si falla la obtención de datos");
  });

  describe("GET /tipos/:idTipo", () => {
    it("debe devolver un tipo cuando el idTipo existe");
    it("debe devolver un error 404 cuando el idTipo no existe");
    it("debe devolver un error 500 si ocurre un fallo en la base de datos");
    it("debe manejar correctamente un idTipo inválido (NaN)");
  });

  describe("POST /tipos", () => {
    it("debe crear un tipo cuando los datos son válidos");
    it("debe devolver 400 si los datos son inválidos");
    it("debe devolver 400 si el tipo ya existe");
    it("debe devolver 500 si hay un error interno");
  });

  describe("PUT /tipos/:idTipo", () => {
    it("debe actualizar un tipo cuando los datos son válidos");
    it("debe devolver 400 si la validación falla");
    it("debe devolver 404 si el tipo no existe");
    it("debe devolver 500 si ocurre un error en el servidor");
    it("debe devolver 400 si el idTipo es inválido");
  });

  describe("DELETE /tipos/:idTipo", () => {
    it("debería eliminar un tipo existente y devolver un estado 200");
    it("debería devolver un estado 404 si el tipo no existe");
    it("debería devolver un estado 500 si ocurre un error interno");
    it("debería devolver un estado 400 si el id no es un número válido");
    it("debería manejar correctamente una solicitud sin parámetro de id");
  });
});
```

## Documentación API

### Endpoints de Estados

#### Obtener Todos los Estados

Recupera una lista de todos los estados.

```
GET /estados
```

##### Respuesta

```json
[
  {
    "idEstado": 1,
    "estado": "Activo"
  },
  {
    "idEstado": 2,
    "estado": "Inactivo"
  }
]
```

#### Obtener Estado por ID

Recupera un estado específico por su ID.

```
GET /estados/:idEstado
```

##### Parámetros

| Parámetro | Tipo   | Descripción                  |
| --------- | ------ | ---------------------------- |
| idEstado  | número | El ID del estado a recuperar |

### Crear Estado

Crea un nuevo estado.

```
POST /estados
```

#### Cuerpo de la Petición

```json
{
  "estado": "Nuevo Estado"
}
```

#### Respuesta

```json
{
  "idEstado": 3,
  "estado": "Nuevo Estado"
}
```

### Actualizar Estado

Actualiza un estado existente.

```
PUT /estados/:idEstado
```

##### Parámetros

| Parámetro | Tipo   | Descripción                  |
| --------- | ------ | ---------------------------- |
| idEstado  | número | El ID del estado a recuperar |

#### Cuerpo de la Petición

```json
{
  "estado": "Estado Actualizado"
}
```

#### Respuesta

```json
{
  "idEstado": 1,
  "estado": "Estado Actualizado"
}
```

### Eliminar Estado

Elimina un estado.

```
DELETE /estados/:idEstado
```

#### Parámetros

| Parámetro | Tipo   | Descripción                  |
| --------- | ------ | ---------------------------- |
| idEstado  | número | El ID del estado a recuperar |

#### Respuesta

```json
{
  "message": "Estado eliminado correctamente"
}
```

### Respuestas de Error

#### 400 Solicitud Incorrecta

```json
{
  "error": "Mensaje de error de validación"
}
```

#### 404 No Encontrado

```json
{
  "message": "Estado no encontrado"
}
```

#### 500 Error Interno del Servidor

```json
{
  "error": "Error interno del servidor"
}
```

### Modelos de Datos

| Campo    | Tipo   | Descripción                     |
| -------- | ------ | ------------------------------- |
| idEstado | número | Identificador único del estado  |
| estado   | texto  | Nombre o descripción del estado |

### Endpoints de Usuarios

#### Obtener Todos los Usuarios

Recupera una lista de todos los usuarios.

**GET /api/usuarios**

##### Respuesta

- **200 OK**: Si la solicitud es exitosa, se devuelve una lista de usuarios con información detallada, junto con la paginación.

```json
{
  "users": [
    {
      "id": "1",
      "email": "user1@example.com",
      "role": "admin",
      "created_at": "2025-03-08T00:00:00Z",
      "updated_at": "2025-03-08T00:00:00Z",
      "app_metadata": { "provider": "email", "providers": ["email"] },
      "user_metadata": {
        "first_name": "Admin User",
        "last_name": "Admin Last Name",
        "avatar_url": "https://example.com/admin-avatar.jpg"
      },
      "aud": "authenticated"
    },
    {
      "id": "2",
      "email": "user2@example.com",
      "role": "user",
      "created_at": "2025-03-08T00:00:00Z",
      "updated_at": "2025-03-08T00:00:00Z",
      "app_metadata": { "provider": "email", "providers": ["email"] },
      "user_metadata": {
        "first_name": "Regular User",
        "last_name": "User Last Name",
        "avatar_url": "https://example.com/user-avatar.jpg"
      },
      "aud": "authenticated"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

#### Obtener Usuario por ID

Recupera un usuario específico por su ID.

**GET /api/usuarios/:id**

##### Parámetros

| Parámetro | Tipo   | Descripción                   |
| --------- | ------ | ----------------------------- |
| id        | número | El ID del usuario a recuperar |

##### Respuesta

- **200 OK**: Si el usuario es encontrado, se devuelve la información completa del usuario.

```json
{
  "id": "1",
  "email": "user1@example.com",
  "role": "admin",
  "created_at": "2025-03-08T00:00:00Z",
  "updated_at": "2025-03-08T00:00:00Z",
  "app_metadata": { "provider": "email", "providers": ["email"] },
  "user_metadata": {
    "first_name": "Admin User",
    "last_name": "Admin Last Name",
    "avatar_url": "https://example.com/admin-avatar.jpg"
  },
  "aud": "authenticated"
}
```

- **500 Internal Server Error**: Si ocurre un error al intentar obtener los usuarios, se devuelve un mensaje de error.

```json
{ "error": "Error interno del servidor" }
```

#### Obtener Usuario por ID

Recupera un usuario específico por su ID.

**GET /api/usuarios/:id**

##### Parámetros

| Parámetro | Tipo   | Descripción                   |
| --------- | ------ | ----------------------------- |
| id        | número | El ID del usuario a recuperar |

##### Respuesta

- **200 OK**: Si el usuario es encontrado, se devuelve la información completa del usuario.

```json
{
  "id": "1",
  "email": "user1@example.com",
  "role": "admin",
  "created_at": "2025-03-08T00:00:00Z",
  "updated_at": "2025-03-08T00:00:00Z",
  "app_metadata": { "provider": "email", "providers": ["email"] },
  "user_metadata": {
    "first_name": "Admin User",
    "last_name": "Admin Last Name",
    "avatar_url": "https://example.com/admin-avatar.jpg"
  },
  "aud": "authenticated"
}
```

- **404 Not Found**: Si el usuario no se encuentra, se devuelve un mensaje indicando que el usuario no fue encontrado.

```json
{ "message": "Usuario no encontrado" }
```

- **500 Internal Server Error**: Si ocurre un error al intentar obtener el usuario, se devuelve un mensaje de error.

```json
{ "error": "Error interno del servidor" }
```

#### Registrar Usuario

Registra un nuevo usuario.

**POST /api/usuarios/sign-up**

##### Cuerpo de la Petición

```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "user_metadata": { "first_name": "New", "last_name": "User" },
  "role": "user"
}
```

##### Respuesta

- **201 Created**: Si el registro es exitoso, se devuelve la información del nuevo usuario.

```json
{
  "idUsuario": 3,
  "email": "newuser@example.com",
  "role": "user",
  "user_metadata": { "first_name": "New", "last_name": "User" }
}
```

- **400 Bad Request**: Si faltan campos obligatorios, se devuelve un mensaje de error.

```json
{ "error": "Required" }
```

- **400 Bad Request**: Si el usuario ya existe, se devuelve un mensaje de error.

```json
{ "error": "El usuario ya existe" }
```

- **500 Internal Server Error**: Si ocurre un error durante el proceso de registro, se devuelve un mensaje de error.

```json
{ "error": "Error interno del servidor" }
```

#### Crear Nuevo Usuario

Crea un nuevo usuario con los datos proporcionados.

**POST /api/usuarios**

##### Body

| Campo         | Tipo   | Descripción                            |
| ------------- | ------ | -------------------------------------- |
| email         | texto  | Correo electrónico del usuario         |
| password      | texto  | Contraseña del usuario                 |
| user_metadata | objeto | Información adicional sobre el usuario |
| first_name    | texto  | Nombre del usuario                     |
| last_name     | texto  | Apellido del usuario                   |
| role          | texto  | Rol del usuario (por ejemplo, user)    |

##### Respuesta

- **201 Created**: Si el usuario es creado correctamente, se devuelve la información del nuevo usuario.

```json
{
  "id": "3",
  "email": "nuevo@usuario.com",
  "role": "user",
  "created_at": "2025-03-08T00:00:00Z",
  "updated_at": "2025-03-08T00:00:00Z",
  "user_metadata": { "first_name": "Nuevo", "last_name": "Usuario" },
  "app_metadata": { "roles": ["user"] }
}
```

- **500 Internal Server Error**: Si ocurre un error al crear el usuario, se devuelve un mensaje de error.

```json
{ "error": "Error al crear usuario" }
```

- **400 Bad Request**: Si los datos de entrada no son válidos (por ejemplo, falta el email), se devuelve un mensaje de error.

```json
{ "error": "El email es obligatorio" }
```

#### Actualizar Usuario

Actualiza los datos de un usuario existente.

**PUT /api/usuarios/:id**

##### Parámetros

| Parámetro | Tipo   | Descripción                    |
| --------- | ------ | ------------------------------ |
| id        | número | El ID del usuario a actualizar |

##### Body

| Campo         | Tipo   | Descripción                            |
| ------------- | ------ | -------------------------------------- |
| email         | texto  | Correo electrónico del usuario         |
| user_metadata | objeto | Información adicional sobre el usuario |
| first_name    | texto  | Nombre del usuario                     |
| last_name     | texto  | Apellido del usuario                   |
| app_metadata  | objeto | Metadatos adicionales (roles, etc.)    |

##### Respuesta

- **200 OK**: Si el usuario es actualizado correctamente, se devuelve la información actualizada del usuario.

```json
{
  "id": "1",
  "email": "nuevo@usuario.com",
  "role": "user",
  "created_at": "2025-03-08T00:00:00Z",
  "updated_at": "2025-03-08T00:00:00Z",
  "user_metadata": { "first_name": "Nuevo", "last_name": "Usuario" },
  "app_metadata": { "roles": ["user"] }
}
```

- **404 Not Found**: Si el usuario no se encuentra, se devuelve un mensaje indicando que el usuario no fue encontrado.

```json
{ "message": "Usuario no encontrado" }
```

- **500 Internal Server Error**: Si ocurre un error al intentar actualizar el usuario, se devuelve un mensaje de error.

```json
{ "error": "Error al actualizar usuario" }
```

#### Eliminar Usuario

Elimina un usuario por su ID.

**DELETE /api/usuarios/:id**

##### Parámetros

| Parámetro | Tipo   | Descripción                  |
| --------- | ------ | ---------------------------- |
| id        | número | El ID del usuario a eliminar |

##### Respuesta

- **200 OK**: Si el usuario es eliminado correctamente, se devuelve un mensaje confirmando la eliminación.

```json
{ "message": "Usuario eliminado correctamente" }
```

- **404 Not Found**: Si el usuario no se encuentra, se devuelve un mensaje indicando que el usuario no fue encontrado.

```json
{ "message": "Usuario eliminado correctamente" }
```

- **404 Not Found**: Si el usuario no se encuentra, se devuelve un mensaje indicando que el usuario no fue encontrado.

```json
{ "message": "Usuario no encontrado" }
```

- **500 Internal Server Error**: Si ocurre un error al intentar eliminar el usuario, se devuelve un mensaje de error.

```json
{ "error": "Error al eliminar usuario" }
```

### Cambiar Contraseña de Usuario

Cambia la contraseña de un usuario por su ID.

**PUT /api/usuarios/:id/password**

##### Parámetros

| Parámetro | Tipo   | Descripción                                        |
| --------- | ------ | -------------------------------------------------- |
| id        | número | El ID del usuario cuya contraseña se desea cambiar |

##### Body

| Campo       | Tipo  | Descripción                                                   |
| ----------- | ----- | ------------------------------------------------------------- |
| newPassword | texto | Nueva contraseña del usuario (debe ser al menos 6 caracteres) |

##### Respuesta

- **200 OK**: Si la contraseña es cambiada correctamente, se devuelve un mensaje confirmando la actualización.

```json
{ "message": "Contraseña cambiada correctamente", "success": true }
```

- **404 Not Found**: Si el usuario no se encuentra, se devuelve un mensaje indicando que el usuario no fue encontrado.

```json
{ "message": "Usuario no encontrado" }
```

- **500 Internal Server Error**: Si ocurre un error al intentar cambiar la contraseña, se devuelve un mensaje de error.

```json
{ "error": "Error al cambiar la contraseña" }
```

- **400 Bad Request**: Si la nueva contraseña es inválida (por ejemplo, demasiado corta), se devuelve un mensaje indicando que la contraseña no cumple con los requisitos.

```json
{ "message": "La contraseña debe tener al menos 6 caracteres" }
```

#### Iniciar Sesión

Inicia sesión con las credenciales de un usuario.

**POST /api/usuarios/sign-in**

##### Cuerpo de la Petición

```json
{ "email": "user@example.com", "password": "securePassword123" }
```

##### Respuesta

- **200 OK**: Si las credenciales son correctas, se devuelve un mensaje de éxito con los detalles del usuario.

```json
{
  "message": "Inicio de sesión exitoso",
  "user": {
    "id": "1",
    "email": "newuser@example.com",
    "role": "user",
    "created_at": "2025-03-08T00:00:00Z",
    "updated_at": "2025-03-08T00:00:00Z",
    "app_metadata": { "provider": "email", "providers": ["email"] },
    "user_metadata": { "first_name": "New", "last_name": "User" },
    "aud": "authenticated"
  }
}
```

- **401 Unauthorized**: Si las credenciales son incorrectas, se devuelve un mensaje de error.

```json
{ "message": "Credenciales inválidas" }
```

- **500 Internal Server Error**: Si ocurre un error durante el proceso de inicio de sesión, se devuelve un mensaje de error.

```json
{ "error": "Error interno del servidor" }
```

#### Cerrar Sesión

Cierra la sesión del usuario.

**POST /api/usuarios/sign-out**

##### Respuesta

- **200 OK**: Si la sesión se cierra correctamente, se devuelve un mensaje de éxito.

```json
{ "message": "Sesión cerrada correctamente" }
```

- **500 Internal Server Error**: Si ocurre un error durante el proceso de cierre de sesión, se devuelve un mensaje de error.

```json
{
  "error": "Error interno del servidor",
  "details": "Error en el cierre de sesión"
}
```

#### Restablecer Contraseña

Inicia el proceso de restablecimiento de la contraseña para un usuario.

**POST /api/usuarios/reset-password**

##### Cuerpo de la Petición

```json
{ "email": "user@example.com" }
```

##### Respuesta

- **200 OK**: Si el restablecimiento es exitoso, se devuelve un mensaje de éxito.

```json
{ "message": "Contraseña restablecida correctamente" }
```

- **400 Bad Request**: Si el email no es válido, se devuelve un mensaje de error.

```json
{ "message": "El email debe ser válido" }
```

- **500 Internal Server Error**: Si ocurre un error durante el proceso de restablecimiento de la contraseña, se devuelve un mensaje de error.

```json
{
  "error": "Error interno del servidor",
  "details": "Error en el restablecimiento de la contraseña"
}
```

### Respuestas de Error Generales

#### 400 Solicitud Incorrecta

```json
{ "error": "Mensaje de error de validación" }
```

#### 404 No Encontrado

```json
{ "message": "Usuario no encontrado" }
```

#### 500 Error Interno del Servidor

```json
{ "error": "Error interno del servidor" }
```

### Modelos de Datos

| Campo         | Tipo   | Descripción                                  |
| ------------- | ------ | -------------------------------------------- |
| idUsuario     | número | Identificador único del usuario              |
| email         | texto  | Correo electrónico del usuario               |
| nombre        | texto  | Nombre completo del usuario                  |
| rol           | texto  | Rol del usuario (por ejemplo, admin, user)   |
| user_metadata | objeto | Información adicional sobre el usuario       |
| first_name    | texto  | Nombre del usuario                           |
| last_name     | texto  | Apellido del usuario                         |
| app_metadata  | objeto | Metadatos de la aplicación (proveedor, etc.) |
| providers     | lista  | Lista de proveedores de autenticación        |
| aud           | texto  | Audiencia del usuario                        |
