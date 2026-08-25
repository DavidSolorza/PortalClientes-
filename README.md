# 🚀 Portal de Clientes - Seguimiento de Proyectos en Tiempo Real (v1.0.0)

El **Portal de Clientes** es una plataforma web moderna, segura y altamente responsiva (**Mobile-First desde 320px+**) diseñada para la gestión transparente y en tiempo real del ciclo de vida del desarrollo de software.

La aplicación permite a los clientes monitorear la fase actual de su proyecto (Planificación, Desarrollo, Pruebas, Despliegue), consultar commits y documentación de GitHub, acceder al **Entorno de Pruebas (Staging)** activo y comunicarse directamente con su líder de proyecto vía WhatsApp.

---

## 🛠️ Tecnologías Utilizadas

- **Core**: React 18 + Vite 5 (JavaScript / JSX)
- **Estilos & Diseño**: Tailwind CSS 3 + Framer Motion (Transiciones y micro-animaciones)
- **Iconografía**: Lucide React
- **Redes & Tiempo Real**: Axios + Socket.io-Client
- **Renderizado de Documentación**: React Markdown + GitHub Flavored Markdown (GFM)

---

## 📋 Historial de Versiones y Changelog

### Version 1.0.0 (Edición de Producción)
- 🔒 **Seguridad & Resiliencia HTTP 4xx**:
  - Interceptores centralizados en `src/core/api.js` para captura de errores `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `409 Conflict` y `429 Too Many Requests`.
  - Inyección segura de cabeceras de autenticación (`Authorization: Bearer` y `X-API-Key`).
  - Implementación del hook `useDebounce` (300ms) para búsquedas evitando saturación de red (anti-HTTP 429).
- 📱 **Diseño Responsivo Adaptativo (Mobile-First 320px+)**:
  - Stepper de etapas (`StageStepper.jsx`) adaptable con desplazamiento táctil suave.
  - Modales (`ProjectModal.jsx`) y tarjetas de dashboard adaptados para teléfonos móviles y pantallas pequeñas.
- 🧪 **Sección de Entorno de Pruebas (Staging)**:
  - Tarjeta dedicada en el portal de cliente con indicador de estado en vivo (*"Activo / Staging"* o *"En Preparación"*) y enlace directo.
- 💬 **Integración WhatsApp de Soporte**:
  - Canal de atención directa configurado con el número oficial `+57 313 737 4108`.
- 📁 **Limpieza y Estructura Liviana**:
  - Remoción de carpetas emuladoras innecesarias y consumo directo de la API de producción (`https://dashboard.servidor.blog`).

---

## 📦 Instalación y Ejecución Local

### 1. Requisitos Previos
- Node.js versión 18.0 o superior
- Administrador de paquetes `npm`

### 2. Pasos de Inicialización
```bash
# 1. Clonar o acceder al repositorio
cd PortalClientes-

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Iniciar el servidor de desarrollo en puerto 5173
npm run dev
```

La aplicación estará disponible en [http://localhost:5173/](http://localhost:5173/).

### 3. Compilación para Producción
```bash
npm run build
```
Los archivos optimizados y minificados se generarán en el directorio `dist/`.

---

## 🔐 Configuración de Variables de Entorno (`.env`)

| Variable | Descripción | Valor por Defecto |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL base de la API REST del Servidor | `https://dashboard.servidor.blog/api/client-portal` |
| `VITE_SOCKET_URL` | URL base de conexión WebSockets | `https://dashboard.servidor.blog` |
| `VITE_ADMIN_KEY` | Llave de API para el panel de administración | `core_backend_secret_key_2026` |
| `VITE_SUPPORT_PHONE` | Número de WhatsApp de atención al cliente | `573137374108` |

> [!CAUTION]
> Nunca incluyas el archivo `.env` en el control de versiones `git`. El archivo `.gitignore` ya está configurado para excluirlo automáticamente.

---

## 🏗️ Estructura del Proyecto

```
PortalClientes-/
├── .env.example               # Plantilla segura de variables de entorno
├── .gitignore                  # Reglas de exclusión para Git (secretos, dist, node_modules)
├── index.html                 # Punto de entrada HTML con meta viewport responsivo
├── package.json               # Dependencias y scripts del proyecto
├── vite.config.js             # Configuración de Vite (puerto 5173 y proxy API)
├── docs/                      # Documentación técnica de arquitectura, DB y API Spec
│   ├── 1_architecture.md
│   ├── 2_database.md
│   └── 3_api_spec.md
└── src/                       # Código fuente de la aplicación
    ├── App.jsx                # Componente principal y enrutado de vistas
    ├── main.jsx               # Punto de entrada de React
    ├── index.css              # Sistema de estilos base y Tailwind CSS
    ├── core/                  # Núcleo de la aplicación
    │   ├── api.js             # Cliente Axios con interceptores de seguridad 4xx
    │   ├── socket.js          # Cliente Socket.io para tiempo real
    │   └── config/            # Constantes globales
    ├── shared/                # Componentes y hooks UI reutilizables
    │   ├── Button.jsx
    │   ├── Card.jsx
    │   ├── MarkdownViewer.jsx
    │   └── hooks/
    │       └── useDebounce.js # Hook para prevenir ráfagas 429
    └── features/              # Rebanadas Verticales Autónomas
        ├── admin/             # Panel de administración de proyectos
        ├── auth/              # Módulo de autenticación unificada
        └── client-space/      # Espacio de cliente (Stepper, GitHub, Staging)
```