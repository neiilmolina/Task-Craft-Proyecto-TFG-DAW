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
│ │ │ ├── EstadosSupabaseDAO.ts # Implementación con Supabase  
│ │ ├── EstadosController.ts # Controlador de Estados  
│ │ ├── EstadosModel.ts # Modelo de Estados  
│ │ ├── interfacesEstados.ts # Definición de interfaces  
│ │ ├── routesEstados.ts # Definición de rutas  
│ │ ├── schemasEstados.ts # Esquemas de validación  
│ ├── /usuarios # Módulo de Usuarios  
│ │ ├── /dao # Data Access Objects (DAO)  
│ │ │ ├── IUsuariosDAO.ts # Interfaz para DAO  
│ │ │ ├── UsuariosSupabaseDAO.ts # Implementación con Supabase  
│ │ ├── UsuariosController.ts # Controlador de Usuarios  
│ │ ├── UsuariosModel.ts # Modelo de Usuarios  
│ │ ├── interfacesUsuarios.ts # Definición de interfaces  
│ │ ├── routesUsuarios.ts # Definición de rutas  
│ │ ├── schemasUsuarios.ts # Esquemas de validación  
│ ├── /config  
│ │ └── supabase.ts # Configuración de Supabase  
│ ├── app.ts # Configuración principal de Express  
├── /tests  
│ ├── /mocks # Carpeta para mocks en testing  
│ │ └── supabase.ts # Crear mock para la conexión a la BD de Supabase  
│ ├── /estados # Tests del módulo Estados  
│ │ ├── EstadosController.test.ts # Pruebas del controlador de Estados  
│ │ ├── EstadosModel.test.ts # Pruebas del modelo de Estados  
│ │ └── routeEstados.test.ts # Pruebas del modelo de Estados  
│ ├── /usuarios # Tests del módulo Usuarios  
│ │ ├── UsuariosController.test.ts # Pruebas del controlador de Usuarios  
│ │ ├── UsuariosModel.test.ts # Pruebas del modelo de Usuarios  
│ │ └── routeUsuarios.test.ts # Pruebas del modelo de Usuarios  
├── server-supabase.ts # Punto de entrada del servidor con Supabase  
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
// Inicialización del DAO y Modelo
const estadosDAO = new EstadosSupabaseDAO();
const estadosModel = new EstadosModel(estadosDAO);

// Creación de la aplicación
createApp(estadosModel);
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

##### 3. EstadosSupabaseDAO.ts

Implementa el acceso a datos utilizando Supabase.

```typescript
class EstadosSupabaseDAO implements IEstadosDAO {
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

El módulo incluye tres tipos de pruebas principales:

##### - EstadosModel.test.ts

Pruebas unitarias para la lógica de negocio:

- Pruebas de obtención de estados
- Pruebas de creación de estados
- Pruebas de actualización de estados
- Pruebas de eliminación de estados
- Manejo de errores y casos límite

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
  let app: Express;
  let mockEstadosModel: jest.Mocked<EstadosModel>;

  beforeEach(() => {
    // Configuración del servidor de pruebas
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

### Usuarios

#### 1. UsuariosController.ts

Maneja las peticiones HTTP y la lógica de control.

```ts
class UsuariosController {
  constructor(private usuariosModel: UsuariosModel) {}

  // Métodos principales:
  getUsuarios: RequestHandler; // GET /usuarios
  getUsuarioById: RequestHandler; // GET /usuarios/:id
  signUp: RequestHandler; // POST /usuarios/signup
  createUsuario: RequestHandler; // POST /usuarios
  updateUsuario: RequestHandler; // PUT /usuarios/:id
  deleteUsuario: RequestHandler; // DELETE /usuarios/:id
  changePassword: RequestHandler; // PATCH /usuarios/change-password
  resetEmail: RequestHandler; // PATCH /usuarios/reset-email
  signIn: RequestHandler; // POST /usuarios/signin
  signOut: RequestHandler; // POST /usuarios/signout
  resetPassword: RequestHandler; // PATCH /usuarios/reset-password
}
```

#### 2. UsuariosModel.ts

Implementa la lógica de negocio y maneja las operaciones con la base de datos.

```ts
class UsuariosModel {
  constructor(private usuariosDAO: IUsuariosDAO) {}

  // Métodos principales:
  signUp(usuario: UsuarioCreate): Promise<AuthResponse>; // Crear un usuario
  signIn(credentials: LoginCredentials): Promise<AuthResponse>; // Iniciar sesión
  signOut(): Promise<void>; // Cerrar sesión
  resetPassword(email: string): Promise<boolean>; // Restablecer la contraseña
  getAll(filters?: UserFilters): Promise<PaginatedUsers>; // Obtener todos los usuarios con filtros y paginación
  getById(id: string): Promise<User | null>; // Obtener usuario por ID
  delete(id: string): Promise<boolean>; // Eliminar un usuario
  create(usuario: UsuarioCreate): Promise<User | null>; // Crear un usuario
  update(id: string, usuario: UsuarioUpdate): Promise<User | null>; // Actualizar un usuario
  changePassword(newPassword: string): Promise<boolean>; // Cambiar la contraseña del usuario
  resetEmail(email: string): Promise<boolean>; // Restablecer el correo del usuario
}
```

#### 3. UsuariosDAO.ts

Implementa el acceso a datos, interactuando con la base de datos.

```ts
interface IUsuariosDAO {
  // Métodos de autenticación
  signUp(userData: UsuarioCreate): Promise<AuthResponse>; // Crear un usuario
  signIn(credentials: LoginCredentials): Promise<AuthResponse>; // Iniciar sesión
  signOut(): Promise<void>; // Cerrar sesión
  resetPassword(email: string): Promise<boolean>; // Restablecer la contraseña

  // Métodos de gestión de usuarios
  getAll(filters?: UserFilters): Promise<PaginatedUsers>; // Obtener todos los usuarios con filtros
  getById(id: string): Promise<User | null>; // Obtener un usuario por su ID
  create(userData: UsuarioCreate): Promise<User | null>; // Crear un usuario
  update(id: string, usuario: UsuarioUpdate): Promise<User | null>; // Actualizar un usuario
  delete(id: string): Promise<boolean>; // Eliminar un usuario

  // Gestión de perfil
  changePassword(newPassword: string): Promise<boolean>; // Cambiar la contraseña del usuario

  // Nuevo método para resetear el email
  resetEmail(email: string): Promise<boolean>; // Restablecer el correo del usuario
}
```

#### 4. Interfaces y Tipos

```typescript
interface user_metadata extends UserMetadata {
  first_name?: string; // Nombre del usuario
  last_name?: string; // Apellido del usuario
  avatar_url?: string; // URL del avatar
}

// Interface para crear un nuevo usuario (sin ID ni marcas de tiempo)
interface UsuarioCreate {
  email: string; // Correo electrónico del usuario
  password: string; // Contraseña del usuario
  user_metadata: user_metadata; // Información adicional del usuario
  role?: string; // Rol del usuario (opcional)
}

// Interface para actualizar la información del usuario (todos los campos opcionales)
interface UsuarioUpdate {
  user_metadata: user_metadata; // Información adicional del usuario
  app_metadata: UserAppMetadata; // Metadata de la aplicación
  role?: string; // Rol del usuario (opcional)
  email?: string; // Correo electrónico del usuario (opcional)
}

// Interface para la respuesta de autenticación
interface AuthResponse {
  message?: string; // Mensaje (opcional)
  user: User | null; // Usuario autenticado
  session: Session | any | null; // Sesión del usuario
  error?: string; // Error (opcional)
}

// Interface para las credenciales de inicio de sesión
interface LoginCredentials {
  email: string; // Correo electrónico del usuario
  password: string; // Contraseña del usuario
}

// Interface para restablecimiento de contraseña
interface PasswordReset {
  email: string; // Correo electrónico del usuario
}

// Interface para el perfil de usuario
interface UserProfile {
  firstName?: string; // Nombre del usuario (opcional)
  lastName?: string; // Apellido del usuario (opcional)
  role?: string; // Rol del usuario (opcional)
  email: string; // Correo electrónico del usuario
}

// Interface para filtros de búsqueda de usuarios
interface UserFilters {
  role?: string; // Rol del usuario (opcional)
  searchTerm?: string; // Término de búsqueda (opcional)
  sortBy?: "createdAt" | "email" | "role"; // Criterio de ordenamiento
  sortOrder?: "asc" | "desc"; // Orden (ascendente o descendente)
  page?: number; // Página de resultados
  limit?: number; // Límite de resultados por página
}

// Interface para la respuesta de paginación de usuarios
interface PaginatedUsers {
  users: User[]; // Lista de usuarios
  total: number; // Total de usuarios
  page: number; // Página actual
  limit: number; // Límite de usuarios por página
  totalPages: number; // Total de páginas disponibles
}
```

#### 5. Pruebas Unitarias y de Integración

El módulo incluye tres tipos de pruebas principales:

##### - UsuariosSupabaseDAO.test.ts

Pruebas unitarias para la conexión con Supabase:

```ts
describe("UsuariosSupabaseDAO", () => {
  let usuariosDAO: UsuariosSupabaseDAO;

  beforeEach(() => {
    usuariosDAO = new UsuariosSupabaseDAO();
    jest.clearAllMocks();
  });

  describe("signUp", () => {
    it("debe registrar un usuario exitosamente");
    it("debe manejar errores en el registro");
  });

  describe("signIn", () => {
    it("debe iniciar sesión exitosamente con credenciales correctas");
    it("debe manejar errores en el inicio de sesión");
  });

  describe("signOut", () => {
    it("debe cerrar sesión exitosamente");
    it("debe manejar errores en el cierre de sesión");
  });

  describe("resetPassword", () => {
    it("debe restablecer la contraseña correctamente");
    it("debe manejar errores en el restablecimiento de contraseña");
  });

  describe("getAll", () => {
    it("debe devolver una lista de usuarios paginada");
  });

  describe("getById", () => {
    it("debe devolver un usuario por ID");
    it("debe manejar errores al obtener un usuario");
  });

  describe("delete", () => {
    it("debe eliminar un usuario por ID");
  });

  describe("create", () => {
    it("debe crear un usuario exitosamente");
    it("debe manejar errores al crear un usuario");
  });

  describe("update", () => {
    it("debe actualizar los datos de un usuario");
  });

  describe("changePassword", () => {
    it("debe cambiar la contraseña de un usuario exitosamente");
    it("debe manejar errores al cambiar la contraseña");
  });

  describe("resetEmail", () => {
    it("debe iniciar el proceso de restablecimiento de email");
    it("debe manejar errores al restablecer el email");
  });
});
```

##### - UsuariosModel.test.ts

```ts
jest.mock("@/config/supabase", () => ({
  __esModule: true,
  default: supabase,
}));

// Mock del DAO
const usuariosDAOMock: IUsuariosDAO = {
  signUp: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  resetPassword: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  changePassword: jest.fn(),
  resetEmail: jest.fn(),
};

// Crear una instancia de UsuariosModel con el DAO simulado
const usuariosModel = new UsuariosModel(usuariosDAOMock);

describe("UsuariosModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signUp", () => {
    it("debe llamar a signUp en el DAO con los argumentos correctos");
    it("debe retornar una respuesta de error si signUp falla");
  });

  describe("signIn", () => {
    it("debe llamar a signIn en el DAO con los argumentos correctos");
    it("debe retornar una respuesta de error si signIn falla");
  });

  describe("signOut", () => {
    it("should call signOut on the DAO");
    it("should throw an error if signOut fails");
  });

  describe("resetPassword", () => {
    it("should call resetPassword on the DAO with the correct email");
    it("should return false if resetPassword fails");
    it("should throw an error if resetPassword throws an exception");
  });

  describe("getAll", () => {
    it(
      "should call getAll on the DAO with the correct filters and return paginated users"
    );
    it("should call getAll on the DAO with no filters and return all users");
    it("should handle errors when getAll fails");
  });

  describe("getById", () => {
    it(
      "should call getById on the DAO with the correct id and return the user"
    );
    it("should return null if the user is not found");
    it("should handle errors when getById fails");
  });

  describe("delete", () => {
    it(
      "should call delete on the DAO with the correct id and return true on success"
    );
    it("should return false if delete fails");
    it("should handle errors when delete fails");
  });

  describe("create", () => {
    it(
      "should call create on the DAO with the correct user and return the created user"
    );
    it("should return null if create fails");
    it("should handle errors when create fails");
  });

  describe("update", () => {
    it(
      "should call update on the DAO with the correct id and updated user data"
    );
    it("should return null if update fails");
    it("should handle errors when update fails");
  });

  describe("changePassword", () => {
    it(
      "should call changePassword on the DAO with the correct new password and return true on success"
    );
    it("should return false if changePassword fails");
    it("should handle errors when changePassword fails");
  });

  describe("resetEmail", () => {
    it(
      "should call resetEmail on the DAO with the correct email and return true on success"
    );
    it("should return false if resetEmail fails");
    it("should handle errors when resetEmail fails");
  });
});
```

#### - UsuariosController.test.ts

```ts
describe("UsuariosController", () => {
  let usuariosController: UsuariosController;
  let mockUsuariosModel: jest.Mocked<UsuariosModel>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    // Configuración de mocks para cada prueba
  });

  describe("UsuariosController - getUsuarios", () => {
    it("should return a list of users with status 200");
    it("should return 500 if an error occurs");
  });

  describe("UsuariosController - getUsuarioById", () => {
    it("should return a user by ID with status 200");
    it("should return 404 if the user is not found");
    it("should return 500 if an error occurs");
  });

  describe("UsuariosController - signUp", () => {
    it("should create a new user and return status 201");
    it("should return 400 if email is missing");
    it("should return 400 if password is missing");
    it("should return 400 if user already exists");
    it("should return 400 if validation fails");
    it("should return 500 if an error occurs");
  });

  describe("UsuariosController - createUsuario", () => {
    it("should create a new user and return status 201");
    it("should return 400 if validation fails");
    it("should return 500 if an error occurs");
  });

  describe("UsuariosController - updateUsuario", () => {
    it("should update a user and return status 200 when validation succeeds");
    it("should return 400 if validation fails");
    it("should return 404 if the user is not found");
    it("should return 500 if an error occurs");
  });

  describe("UsuariosController - deleteUsuario", () => {
    it("should delete a user and return status 200");
    it("should return 404 if the user is not found");
    it("should return 500 if an error occurs");
  });

  describe("UsuariosController - changePassword", () => {
    it("should change the password and return status 200");
    it("should return 400 if the password is invalid");
    it("should return 404 if the user is not found");
    it("should return 500 if an error occurs");
  });

  describe("UsuariosController - resetEmail", () => {
    it("should reset the email and return status 200");
    it("should return 400 if the email reset fails");
    it("should return 500 if an error occurs");
    it("should return 400 if the email validation fails");
  });

  describe("UsuariosController - signIn", () => {
    it("should sign in a user and return status 200");
    it("should return 401 if credentials are invalid");
    it("should return 500 if an error occurs");
  });

  describe("signOut", () => {
    it("should return 200 if the session is successfully closed");
    it("should return 500 if there is an error while signing out");
  });

  describe("resetPassword", () => {
    it("should return 200 if password is successfully reset");
    it("should return 400 if there is an error resetting the password");
    it("should return 500 if there is an internal server error");
    it("should return 400 if the email is invalid");
  });
});
```

##### - UsuariosRoutes.test.ts

Pruebas de integración para las rutas:

```ts
describe("Usuarios Routes", () => {
  let app: express.Application;
  let mockUsuariosModel: jest.Mocked<UsuariosModel>;

  beforeEach(() => {
    // Configuración del servidor de pruebas
  });

  describe("GET /api/usuarios", () => {
    it("debería devolver todos los usuarios");
    it("debería manejar errores al obtener usuarios");
  });

  describe("GET /api/usuarios/:id", () => {
    it("debería devolver un usuario por ID");
    it("debería devolver 404 si el usuario no existe");
    it("debería manejar errores al obtener un usuario por ID");
  });

  describe("POST /api/usuarios", () => {
    it("debería crear un nuevo usuario correctamente");
    it("debería manejar errores al crear un nuevo usuario");
    it("debería validar datos de entrada");
  });

  describe("PUT /api/usuarios/:id", () => {
    it("debería actualizar un usuario correctamente");
    it("debería devolver 404 si el usuario no existe");
    it("debería manejar errores al actualizar un usuario");
  });

  describe("DELETE /api/usuarios/:id", () => {
    it("debería eliminar un usuario correctamente");
    it("debería devolver 404 si el usuario no existe");
    it("debería manejar errores al eliminar un usuario");
  });

  describe("PUT /api/usuarios/:id/password", () => {
    it("debería cambiar la contraseña de un usuario correctamente");
    it("debería devolver 404 si el usuario no existe");
    it("debería manejar errores al cambiar la contraseña");
    it("debería devolver 400 si la contraseña es inválida");
  });

  describe("POST /api/usuarios/sign-in", () => {
    it("debería iniciar sesión correctamente");
    it("debería devolver 401 si las credenciales son inválidas");
    it("debería manejar errores internos durante el inicio de sesión");
  });

  describe("POST /api/usuarios/sign-up", () => {
    it("should create a new user and return status 201");
    it("should return 400 if email is missing");
    it("should return 400 if password is missing");
    it("should return 400 if user already exists");
    it("should return 500 if an error occurs");
  });

  describe("POST /api/usuarios/sign-out", () => {
    it("should return 200 if the user is signed out successfully");
    it("should return 500 if there is an error during sign out");
  });

  describe("POST /api/usuarios/reset-password", () => {
    it("should return 200 when the password is reset successfully");
    it("should return 400 if email is invalid");
    it("should return 500 if there is an internal error during reset password");
  });

});

const createMockUser = (id: string): User
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
