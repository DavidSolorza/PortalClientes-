# Especificación Completa de la API REST y WebSockets (QA & Spec)

## 1. Resumen Ejecutivo
La API del Portal de Clientes expone un conjunto de endpoints RESTful bajo los prefijos `/api/client-portal` y `/api/portal-clientes`. La especificación garantiza compatibilidad con variaciones en los nombres de campos del payload (español e inglés), normalización inteligente de etapas del ciclo de vida, respuestas estandarizadas y transmisión de eventos en tiempo real.

---

## 2. Autenticación y Encabezados de Seguridad

### Operaciones Administrativas (CRUD y Métricas)
Requieren autenticación mediante cualquiera de los siguientes encabezados HTTP:
- `Authorization: Bearer core_backend_secret_key_2026`
- `X-API-Key: core_backend_secret_key_2026`

### Encabezados de Seguridad Inyectados por el Servidor
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy: default-src 'self'`

---

## 3. Matriz Estricta de Respuestas y Errores HTTP

| Código HTTP | Descripción | Estructura JSON de Respuesta |
| :--- | :--- | :--- |
| **`200 OK`** | Operación exitosa de consulta o actualización. | `{ "status": "success", "data": { ... } }` o `{ "project": { ... } }` |
| **`201 Created`** | Recurso creado exitosamente. | `{ "message": "Proyecto creado exitosamente", "data": { ... } }` |
| **`400 Bad Request`** | Parámetros inválidos o formato JSON erróneo. | `{ "status": "error", "message": "El nombre del cliente es obligatorio." }` |
| **`401 Unauthorized`** | Falta token o API Key inválida. | `{ "status": "error", "message": "Acceso no autorizado. Se requiere una API Key válida." }` |
| **`403 Forbidden`** | Contraseña de acceso al espacio de cliente incorrecta. | `{ "status": "error", "message": "Contraseña incorrecta para el portal." }` |
| **`422 Unprocessable Entity`** | Fallo en la validaciones de reglas de negocio o slug duplicado. | `{ "status": "error", "message": "El slug 'cliente-duplicado' ya está en uso." }` |
| **`429 Too Many Requests`** | Exceso de peticiones detectado por el Rate Limiter. | `{ "status": "error", "message": "Demasiadas peticiones. Por favor intente más tarde." }` |
| **`500 Internal Server Error`** | Error interno no controlado del servidor. | `{ "status": "error", "message": "Error interno del servidor." }` |

---

### 3.1. Protocolo de Captura y Preservación de Errores de Cliente (Client Error Propagation)
Para evitar que los mecanismos de *fallback* (ej. reintento de rutas alternativas `/spaces` vs `/projects`) enmascaren mensajes de error originales del servidor con fallos secundarios de autorización (`401`):

1. **Interceptor HTTP Global (`src/core/api.js`):** Extrae prioritariamente la propiedad `error.response.data.error` seguida de `error.response.data.message` para garantizar que la descripción estructurada del backend se preserve intacta.
2. **Propagación en Capa de Servicios:** Al ocurrir un fallo en una ruta primaria, el bloque `catch` captura la excepción previa `primaryErr`. Si el endpoint secundario en el fallback también falla, el servicio relanza `primaryErr` asegurando que la UI despliegue el mensaje y código HTTP original del fallo (ej. `409 Conflict` por slug duplicado o `401 Unauthorized` por credenciales inválidas).

---

## 4. Endpoints Principales

### Auth: Verificar Acceso de Cliente (`POST /api/client-portal/auth/verify`)
- **Headers**: `Content-Type: application/json`
- **Body**: `{ "slug": "acme", "password": "pass" }`
- **Respuestas**:
  - `200 OK`: `{ "status": "success", "authenticated": true, "project": { ... } }`
  - `400 Bad Request`: `{ "status": "error", "message": "El slug y la contraseña son requeridos" }`
  - `403 Forbidden`: `{ "status": "error", "message": "Contraseña incorrecta" }`

### Projects: Crear Proyecto (`POST /api/client-portal/projects` o `/spaces`)
- **Headers**: `Authorization: Bearer <ADMIN_KEY>`, `Content-Type: application/json`
- **Body**: `{ "client_name": "Acme", "password": "secret_pass", "current_stage": "Desarrollo" }`
- **Respuestas**:
  - `201 Created`: `{ "message": "Proyecto creado exitosamente", "data": { ... } }`
  - `400 Bad Request`: `{ "status": "error", "message": "Faltan campos requeridos" }`

### Reset Password: Restablecer / Generar Contraseña (`POST /api/client-portal/spaces/:slug/reset-password`)
- **Headers**: `Authorization: Bearer <ADMIN_KEY>`, `Content-Type: application/json`
- **Modo A (Aleatorio)**: Body `{}` -> Retorna `{ "message": "...", "new_password": "JPYRpAgv3kN0" }`
- **Modo B (Personalizado)**: Body `{ "password": "mi_nueva_clave_123" }` -> Retorna `{ "message": "...", "new_password": "mi_nueva_clave_123" }`
- **Respuestas**:
  - `200 OK`: `{ "status": "success", "message": "Contraseña restablecida", "new_password": "..." }`
  - `404 Not Found`: `{ "status": "error", "message": "Espacio no encontrado" }`

---

## 5. Eventos en Tiempo Real (Socket.io)

| Evento | Descripción | Payload Transmitido |
| :--- | :--- | :--- |
| `client_portal:project-created` | Emitido al crear un proyecto. | Objeto completo del nuevo proyecto (sin hash de contraseña). |
| `client_portal:project-updated` | Emitido al modificar estado o datos. | Objeto actualizado del proyecto. |
| `client_portal:project-deleted` | Emitido al eliminar un proyecto. | Objeto `{ "id": 1, "slug": "acme" }`. |
