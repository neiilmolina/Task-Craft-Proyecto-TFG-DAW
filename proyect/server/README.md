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
    SUPABASE_KEY=<tu_clave_de_supabase>
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
- **`SUPABASE_KEY`**: Clave de tu instancia de Supabase.
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

##### - EstadosSupabaseDAO.test.ts

Pruebas unitarias para la conexión con Supabase:

```ts
describe("EstadosSupabaseDAO", () => {
  let estadosDAO: EstadosSupabaseDAO;
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
