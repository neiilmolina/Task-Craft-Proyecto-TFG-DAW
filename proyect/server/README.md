# Server - Task Craft Management API

Este es el servidor de la aplicación de gestión de tareas y objetivos. Está construido utilizando **Node.js**, **Express**, **TypeScript** y **Supabase** como base de datos. Esta API ofrece funcionalidades para gestionar tareas, objetivos, y proporciona una interfaz para interactuar con la base de datos.

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

2. Instala las dependencias:

   ```bash
    npm install

3. Crea un archivo .env con tus variables de entorno. Ejemplo:

   ```bash
    SUPABASE_URL=<tu_url_de_supabase>
    SUPABASE_KEY=<tu_clave_de_supabase>

## Scripts

El archivo package.json incluye los siguientes scripts:

- **`build`**: Compila el código TypeScript a JavaScript.
  ```bash
  npm run build

- **`start`**: Inicia el servidor en producción utilizando el código JavaScript compilado.

    ```bash
    npm start

- **`dev`**: Inicia el servidor en modo desarrollo, utilizando nodemon para reiniciar el servidor automáticamente al hacer cambios en los archivos TypeScript.

    ```bash
    npm run dev
- **`prod`**: Compila el código TypeScript y luego inicia el servidor en producción.

    ```bash
    npm run prod


## Estructura del Proyecto
La estructura básica de los archivos es la siguiente:

/server
├── /src
│   ├── /controllers      # Lógica para manejar las rutas
│   ├── /services         # Servicios para manejar la lógica de negocio
│   ├── /models           # Modelos para interactuar con la base de datos
│   ├── /routes           # Rutas de la API
│   ├── /utils            # Utilidades generales
│   ├── index.ts          # Archivo principal que inicia el servidor
├── /tests                # Carpeta con pruebas unitarias y de integración
├── tsconfig.json         # Configuración de TypeScript
├── package.json          # Dependencias y scripts
└── .env                  # Variables de entorno


## Variables de Entorno
Este proyecto utiliza el archivo .env para manejar las variables de entorno. Asegúrate de definir las siguientes variables en tu archivo .env:

- **`SUPABASE_URL`**: URL de tu instancia de Supabase.
- **`SUPABASE_KEY`**: Clave de tu instancia de Supabase.