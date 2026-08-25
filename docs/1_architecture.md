# Documento de Arquitectura de Software (SOLID & Vertical Slicing)

## 1. Resumen Ejecutivo
El sistema **Portal de Clientes** es una plataforma de alta cohesión diseñada para la gestión transparente de proyectos de software en distintas etapas de desarrollo (Planificación, Desarrollo, Pruebas, Despliegue). 

La arquitectura adopta una estrategia de **Vertical Slicing por Capas** (`domain`, `application`, `infrastructure`), combinada con un **Event/Service Bus desacoplado**, estricta adherencia a los **Principios SOLID** y un **Escudo de Seguridad Multicapa** (anti-SQL Injection, XSS, Rate Limiting, CORS & Tunnel Hardening).

---

## 2. Diagrama de Componentes e Interacción (Mermaid)

```mermaid
graph TD
    subgraph Cliente [Frontend SPA - React + Vite]
        AuthUI[src/features/auth]
        AdminUI[src/features/admin]
        ClientUI[src/features/client-space]
        
        CoreAPI[src/core/api.js - Axios Client]
        CoreSocket[src/core/socket.js - Socket.io Client]
        ConfigConst[src/core/config/constants.js]
        
        AuthUI --> CoreAPI
        AdminUI --> CoreAPI
        ClientUI --> CoreAPI
        ClientUI --> CoreSocket
        ClientUI --> ConfigConst
    end

    subgraph Servidor [Backend API - Node.js + Express]
        SecurityLayer[Security Middleware: RateLimiter + SecurityHeaders + AntiXSS]
        HTTPListener[Express Server Port 5000]
        
        subgraph CoreBackend [Core Infrastructure & Bus]
            EventBus[EventBus - Service/Event Bus Centralized]
            WSServer[Socket.io Broadcaster]
            PgPool[PostgreSQL Pool / Memory Fallback]
        end
        
        subgraph ProjectsSlice [Feature: Projects (Vertical Slice)]
            ProjController[Infrastructure: ProjectController]
            ProjUseCase[Application: ProjectUseCase]
            ProjEntity[Domain: ProjectEntity]
            IRepository[Domain: IProjectRepository Contract]
            PgRepository[Infrastructure: PgProjectRepository - 100% Parameterized]
            MemRepository[Infrastructure: MemoryProjectRepository]
        end

        subgraph AuthSlice [Feature: Auth (Vertical Slice)]
            AuthController[Infrastructure: AuthController]
            AuthUseCase[Application: AuthUseCase]
        end
        
        HTTPListener --> SecurityLayer
        SecurityLayer --> AuthController
        SecurityLayer --> ProjController
        
        ProjController --> ProjUseCase
        ProjUseCase --> ProjEntity
        ProjUseCase --> IRepository
        IRepository <|-- PgRepository
        IRepository <|-- MemRepository
        PgRepository --> PgPool
        
        ProjUseCase --> EventBus
        EventBus --> WSServer
        
        AuthController --> AuthUseCase
        AuthUseCase --> PgPool
    end

    subgraph Persistencia [Base de Datos Relacional]
        PostgreSQL[(PostgreSQL Database)]
    end

    PgPool --> PostgreSQL
```

---

## 3. Principios SOLID y Subcapas por Vertical Slicing

### 3.1. Estructura de Subcapas (`src/features/[feature]/`)
- **`domain/`**: Entidades puras y contratos de interfaz (`IProjectRepository`). Cero dependencias de bibliotecas HTTP o persistencia externa. *(Single Responsibility & Dependency Inversion)*.
- **`application/`**: Casos de uso de negocio (`ProjectUseCase`, `AuthUseCase`). Orquestan reglas de dominio, persisten a través de interfaces de dominio y despiden eventos de dominio al `EventBus`. *(Open/Closed Principle)*.
- **`infrastructure/`**: Controladores HTTP, adaptadores PostgreSQL (con consultas `$1, $2` 100% parametrizadas), repositorios reactivos en memoria y rutas de Express.

### 3.2. Sustitución de Liskov (LSP) en Persistencia
`PgProjectRepository` y `MemoryProjectRepository` implementan idéntico contrato de dominio (`IProjectRepository`). El sistema puede alternar dinámicamente entre PostgreSQL o el fallback reactivo en memoria sin alterar los casos de uso ni romper la aplicación.

### 3.3. Event / Service Bus (`server/src/core/bus/EventBus.js`)
Los efectos secundarios (notificaciones Socket.io, registro de actividad) están completamente desacoplados de la lógica de controladores y casos de uso mediante un `EventBus` en memoria basado en `EventEmitter`.

---

## 4. Escudo de Seguridad Multicapa

1. **Anti-SQL Injection**: Consultas parametrizadas obligatorias al 100% (`WHERE id = $1`, `client_name = $2`). Desinfectador de parámetros previene inyecciones en cadenas o identificadores.
2. **Anti-XSS & Sanitización de Entradas**: Middleware desinfectador de payloads JSON y parámetros de consulta (`req.body`, `req.query`, `req.params`) eliminando etiquetas `<script>` e inyecciones de HTML.
3. **Rate Limiting**: Limitador de tasa en memoria por IP para evitar ataques de fuerza bruta en `/api/client-portal/auth/login` y denegación de servicio (DoS) en la API.
4. **Header Hardening**: Inyección de encabezados de seguridad HTTP (Helmet style): `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, `Referrer-Policy: strict-origin-when-cross-origin`, y `Content-Security-Policy`.
5. **Autenticación con Timing-Safe Comparison**: Verificación de tokens API Key utilizando `crypto.timingSafeEqual` para inmunizar el servidor contra ataques por medición de tiempo.

---

## 5. Registro de Decisiones de Arquitectura (ADR)

### ADR-001: Adopción del Patrón Event Bus para Notificaciones
- **Estado**: Aprobado.
- **Contexto**: Se requería desacoplar la capa de almacenamiento y casos de uso de la emisión de eventos de Socket.io.
- **Decisión**: Crear un `EventBus` singleton en `server/src/core/bus/EventBus.js`.
- **Consecuencias**: Casos de uso emitirán eventos neutros (`project.created`, `project.updated`), escuchados automáticamente por la capa Socket.io.

### ADR-002: Hardening Anti-Inyección SQL & Consultas 100% Parametrizadas
- **Estado**: Aprobado.
- **Contexto**: Eliminar vulnerabilidades de concatenación de SQL en el driver `pg`.
- **Decisión**: Prohibir consultas concatenadas y utilizar `$1, $2, ...` en todos los métodos de los repositorios.
- **Consecuencias**: Inmunidad completa contra inyecciones SQL relacionales.
