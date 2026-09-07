# Especificación y Diseño de Base de Datos (Principal DBA)

## 1. Resumen Ejecutivo
El sistema Portal de Clientes utiliza **PostgreSQL** como motor de persistencia relacional primario. El esquema cumple con la **Tercera Forma Normal (3NF)**, cuenta con restricciones explícitas de integridad relacional (`NOT NULL`, `UNIQUE`, `CHECK`), índices aceleradores para consultas por `project_slug` y `client_name`, y garantía total contra vulnerabilidades de inyección SQL a través de consultas 100% parametrizadas (`$1, $2, ...`).

---

## 2. Script DDL Inmaculado de Creación e Indexación

```sql
-- Script DDL para la entidad física de Proyectos
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    project_slug VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    github_repo VARCHAR(255),
    testing_link VARCHAR(255),
    current_stage VARCHAR(50) NOT NULL DEFAULT 'Planificación',
    theme_color VARCHAR(20) NOT NULL DEFAULT '#3B82F6',
    last_activity TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_current_stage CHECK (current_stage IN ('Planificación', 'Desarrollo', 'Pruebas', 'Despliegue'))
);

-- Índices B-Tree optimizados para acelerar las lecturas por slug y búsqueda por cliente
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects (project_slug);
CREATE INDEX IF NOT EXISTS idx_projects_client_name ON projects (client_name);
CREATE INDEX IF NOT EXISTS idx_projects_current_stage ON projects (current_stage);
```

---

## 3. Diccionario de Datos Exhaustivo

### Entidad Relacional: `projects`

| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción Detallada |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY, NOT NULL` | Identificador único secuencial e inmutable del proyecto. |
| `client_name` | `VARCHAR(100)` | `NOT NULL` | Nombre comercial o razón social del cliente (ej. "Acme Corp"). |
| `project_slug` | `VARCHAR(50)` | `UNIQUE, NOT NULL` | Identificador único en URL para acceso directo al portal de cliente. |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | Hash cifrado seguro generado con algoritmo `scrypt` y sal única. |
| `email` | `VARCHAR(255)` | `NULL` | Correo electrónico de contacto/notificaciones del cliente (ej. "contacto@cliente.com"). |
| `github_repo` | `VARCHAR(255)` | `NULL` | Repositorio GitHub en formato `owner/repo` asociado al proyecto. |
| `testing_link` | `VARCHAR(255)` | `NULL` | Enlace HTTPS al entorno activo de pruebas o staging. |
| `current_stage` | `VARCHAR(50)` | `NOT NULL, DEFAULT 'Planificación', CHECK` | Etapa del ciclo de vida (`Planificación`, `Desarrollo`, `Pruebas`, `Despliegue`). |
| `theme_color` | `VARCHAR(20)` | `NOT NULL, DEFAULT '#3B82F6'` | Código de color Hexadecimal (`#RRGGBB`) de identidad visual del cliente. |
| `last_activity` | `TIMESTAMP` | `NOT NULL, DEFAULT CURRENT_TIMESTAMP` | Estampa de tiempo del último avance registrado. |
| `created_at` | `TIMESTAMP` | `NOT NULL, DEFAULT CURRENT_TIMESTAMP` | Estampa de tiempo exacta de alta en el sistema. |

---

## 4. Política Anti-Inyección SQL & Seguridad de Datos

1. **Consultas 100% Parametrizadas**: Ninguna sentencia SQL es construida mediante concatenación directa de cadenas. El conector nativo `pg` utiliza variables bind (`$1, $2, $3, ...`).
2. **Validación Previa de Entrada**: La capa de infraestructura valida tipos de datos y desinfecta cadenas mediante expresiones regulares antes de interactuar con el pool de conexiones.
3. **Resiliencia & Failover**: Si el servidor PostgreSQL pierde conectividad, la capa de acceso a datos degrada suavemente a un repositorio en memoria sin perder operatividad en caliente.
