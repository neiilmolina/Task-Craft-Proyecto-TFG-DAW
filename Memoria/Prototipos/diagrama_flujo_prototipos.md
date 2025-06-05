# Diagrama de Flujo - Task Craft (Prototipos)

```mermaid
flowchart TD
    %% Flujo de Autenticación
    Start([Inicio]) --> Login[Login.jpg]
    Start --> Registro[Registro.jpg]
    
    Login --> Dashboard{Dashboard Principal}
    Registro --> Dashboard
    
    %% Dashboard Principal - Navegación Principal
    Dashboard --> Tareas[Tareas.jpg]
    Dashboard --> Diarios[Diarios.jpg]
    Dashboard --> Amigos[Lista de Amigos.jpg]
    Dashboard --> Calendario[Calendario.jpg]
    Dashboard --> Usuario[Usuario.jpg]
    
    %% Flujo de Tareas
    Tareas --> AñadirTarea[Añadir Tarea.jpg]
    Tareas --> DetallesTarea[Detalles Tarea.jpg]
    AñadirTarea --> Tareas
    DetallesTarea --> Tareas
    
    %% Flujo de Diarios
    Diarios --> AñadirDiario[Añadir Diario.jpg]
    Diarios --> DetallesDiarios[Detalles Diarios.jpg]
    AñadirDiario --> Diarios
    DetallesDiarios --> Diarios
    
    %% Flujo de Amigos
    Amigos --> EnviarSolicitud[Enviar Solicitud.jpg]
    Amigos --> SolicitudesAmigos[Solicitudes Amigos.jpg]
    Amigos --> SolicitudesTareas[Solicitudes Tareas.jpg]
    Amigos --> SolicitudesTodas[Solicitudes Todas.jpg]
    
    EnviarSolicitud --> Amigos
    SolicitudesAmigos --> Amigos
    SolicitudesTareas --> Amigos
    SolicitudesTodas --> Amigos
    
    %% Configuración de Usuario
    Usuario --> Admin[Admin.jpg]
    Admin --> Usuario
    
    %% Navegación de retorno al Dashboard
    Tareas -.-> Dashboard
    Diarios -.-> Dashboard
    Amigos -.-> Dashboard
    Calendario -.-> Dashboard
    Usuario -.-> Dashboard
    
    %% Estilos
    classDef authFlow fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef taskFlow fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef diaryFlow fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef friendFlow fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef userFlow fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    classDef calendarFlow fill:#f1f8e9,stroke:#33691e,stroke-width:2px
    classDef dashboard fill:#fff8e1,stroke:#ff8f00,stroke-width:3px
    
    class Start,Login,Registro authFlow
    class Tareas,AñadirTarea,DetallesTarea taskFlow
    class Diarios,AñadirDiario,DetallesDiarios diaryFlow
    class Amigos,EnviarSolicitud,SolicitudesAmigos,SolicitudesTareas,SolicitudesTodas friendFlow
    class Usuario,Admin userFlow
    class Calendario calendarFlow
    class Dashboard dashboard
```

## Descripción de los Flujos

### 🔐 Auth Flow (Flujo de Autenticación)
- **Login.jpg**: Página de inicio de sesión
- **Registro.jpg**: Página de registro de nuevos usuarios

### 📊 Dashboard Flow (Flujo Principal)
El dashboard actúa como hub central que conecta con todos los módulos:

#### 📝 Tasks Flow (Flujo de Tareas)
- **Tareas.jpg**: Lista principal de tareas
- **Añadir Tarea.jpg**: Formulario para crear nueva tarea
- **Detalles Tarea.jpg**: Vista detallada de una tarea específica

#### 📖 Diaries Flow (Flujo de Diarios)
- **Diarios.jpg**: Lista principal de entradas de diario
- **Añadir Diario.jpg**: Formulario para crear nueva entrada
- **Detalles Diarios.jpg**: Vista detallada de una entrada específica

#### 👥 Friends Flow (Flujo de Amigos)
- **Lista de Amigos.jpg**: Lista de amigos del usuario
- **Enviar Solicitud.jpg**: Enviar solicitud de amistad
- **Solicitudes Amigos.jpg**: Gestionar solicitudes de amistad
- **Solicitudes Tareas.jpg**: Gestionar solicitudes relacionadas con tareas
- **Solicitudes Todas.jpg**: Vista unificada de todas las solicitudes

#### 📅 Calendar Flow (Flujo de Calendario)
- **Calendario.jpg**: Vista de calendario con eventos y tareas

#### ⚙️ User Settings Flow (Flujo de Configuración)
- **Usuario.jpg**: Configuración del perfil de usuario
- **Admin.jpg**: Panel de administración (para usuarios admin)

## Leyenda de Colores
- 🔵 **Azul**: Flujo de Autenticación
- 🟣 **Púrpura**: Flujo de Tareas
- 🟢 **Verde**: Flujo de Diarios
- 🟠 **Naranja**: Flujo de Amigos
- 🔴 **Rosa**: Configuración de Usuario
- 🟡 **Amarillo**: Dashboard Principal
- 🌿 **Verde Claro**: Calendario

Las líneas punteadas (-.->)  representan la navegación de retorno al dashboard principal desde cualquier sección.

