# Aplicación Serverless - Gestor de Tareas (Backend)
- Por ahora hicimos solo el back

## Características que fuimos cumpliendo
- **Arquitectura Serverless:** Desarrollado con Node.js + Express usando el empaquetador `serverless-http` y listo para desplegar en **Vercel**.
- **Autenticación de Usuarios:** Registro y Login nativo. Las contraseñas se encriptan con `bcryptjs` y el manejo de sesiones se realiza mediante **JSON Web Tokens (JWT)**.
- **Persistencia en la Nube:** Integrado con una base de datos PostgreSQL Serverless alojada en **Neon.tech**.
- **CRUD Completo:** Sistema para Crear, Leer, Actualizar y Eliminar (CRUD) tareas. Cada usuario visualiza y manipula estrictamente sus propios datos gracias a la protección por token.

## Tecnologias
- **Entorno:** Node.js
- **Framework REST:** Express.js
- **Base de Datos:** PostgreSQL (Neon DB)
- **Seguridad:** hashing (Bcrypt) + Auth (JWT)
- **Hosting:** Vercel

## Arquitectura del back

* `src/db/` -> Configuración y conexión con Neon PostgreSQL. Incluye un script `init.js` que automatiza la creación de las tablas (`users` y `tasks`).
* `src/middlewares/` -> Contiene el middleware interceptor (`auth.js`) que valida que el usuario posea un Token válido antes de dejarlo acceder a sus tareas.
* `src/services/` -> Capa de servicio. Aquí vive la **lógica de negocio** y las consultas SQL (separando la base de datos de las rutas HTTP).
* `src/controllers/` -> Se encargan de validar la Request (`req.body`), llamar al Servicio correspondiente, y emitir la Response (`res.json`).
* `src/routes/` -> Definición de las URLs de consumo (Endpoints).

## Todavia la estructura de las carpetas que habia dicho la consigna no las hicimos

## Cómo correr el proyecto:

La API de Vercel: `https://tp-2-frontend-ashen.vercel.app/`.

## Endpoints Principales hechos:
**Autenticación (`/api/auth`)** (Públicas)
- `POST /register`: Crea un nuevo usuario.
- `POST /login`: Inicia sesión y devuelve un token JWT.

**Tareas (`/api/tasks`)** (Protegidas por Token)
- `GET /`: Devuelve las tareas del usuario autenticado.
- `POST /`: Crea una nueva tarea asignada al usuario autenticado.
- `PUT /:id`: Actualiza una tarea existente (Ejemplo: enviar un PUT a `/api/tasks/5` para editar la tarea con ID 5 en la base de datos).
- `DELETE /:id`: Elimina una tarea existente (Ejemplo: enviar un DELETE a `/api/tasks/5` para borrar la tarea con ID 5 en la base de datos).


# Planify — Frontend

Aplicación web de gestión de tareas con interfaz kanban. Permite crear, organizar y completar tareas distribuidas en tres columnas de estado: **Lista de tareas**, **En proceso** y **Hecho**.

---

## Tecnologías utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| React | 18+ | Framework principal de UI |
| React Router DOM | 6+ | Ruteo client-side |
| Axios | latest | Comunicación con la API REST |
| CSS Modules (plain) | — | Estilos por componente |
| Poppins (Google Fonts) | — | Tipografía |

---

## Estructura del proyecto

```
frontend/
├── public/
│   └── index.html
└── src/
    ├── App.jsx              # Raíz de la app, manejo de autenticación y rutas
    ├── App.css              # Reset global, fuente Poppins, color base
    ├── index.js             # Entry point de React
    ├── index.css            # Estilos mínimos de body
    ├── pages/
    │   ├── Home.jsx         # Landing page pública
    │   ├── Login.jsx        # Formulario de inicio de sesión
    │   ├── Register.jsx     # Formulario de registro
    │   └── Dashboard.jsx    # Vista principal con el kanban
    ├── components/
    │   └── TaskForm.jsx     # Formulario inline de creación de tareas
    └── styles/
        ├── home.css
        ├── auth.css         # Compartido entre Login y Register
        ├── dashboard.css    # Layout kanban, cards, header
        └── taskform.css     # Formulario inline de columna
```

---

## Instalación y ejecución

### Requisitos previos

- Node.js 18+
- npm o yarn
- Backend corriendo en `http://localhost:3001`

### Pasos

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd frontend

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm start
```

La app queda disponible en `http://localhost:3000`.

---

## Rutas de la aplicación

| Ruta | Componente | Acceso |
|---|---|---|
| `/` | `Home.jsx` | Público — redirige al dashboard si hay sesión activa |
| `/login` | `Login.jsx` | Público — redirige al dashboard si hay sesión activa |
| `/register` | `Register.jsx` | Público — redirige al dashboard si hay sesión activa |
| `/dashboard` | `Dashboard.jsx` | Privado — redirige a `/login` si no hay token |

La autenticación se maneja en `App.jsx` mediante el estado `isAuthenticated`, que se inicializa leyendo el `token` de `localStorage` al montar la app.

---

## Autenticación

El flujo de autenticación es el siguiente:

1. El usuario se registra en `/register`. El nombre se genera automáticamente a partir del email (todo lo que está antes del `@`).
2. Al hacer login exitoso, el backend devuelve un JWT que se guarda en `localStorage` bajo la clave `token`. También se guarda el `userId`.
3. Todas las requests al backend incluyen el header `Authorization: Bearer <token>`.
4. Al hacer logout, se eliminan `token` y `userId` de `localStorage` y se redirige a `/login`.

---

## Componentes

### `App.jsx`

Punto de entrada de la interfaz. Maneja:

- Estado global de autenticación (`isAuthenticated`)
- Estado de carga inicial (`loading`) mientras se verifica el token
- Definición de todas las rutas con protección condicional usando `<Navigate>`

Props transmitidas: `setIsAuthenticated` se pasa hacia `Login` y `Dashboard` para poder actualizar el estado global desde esos componentes.

---

### `Home.jsx`

Landing page pública. Presenta la marca **Planify**, una descripción de la app, y botones de acceso rápido a Login y Register. Incluye una grilla de 4 features destacadas.

---

### `Login.jsx`

Formulario de inicio de sesión con campos de email y contraseña. Realiza un `POST /api/auth/login`. Al recibir el token, actualiza `isAuthenticated` y navega al dashboard.

---

### `Register.jsx`

Formulario de registro con email, contraseña y confirmación de contraseña. Valida que las contraseñas coincidan y tengan al menos 6 caracteres antes de hacer el request. Redirige a `/login` tras 2 segundos de registro exitoso.

---

### `Dashboard.jsx`

Vista principal de la aplicación. Contiene toda la lógica del tablero kanban.

**Estado local:**

| Estado | Tipo | Descripción |
|---|---|---|
| `tasks` | `Array` | Lista completa de tareas del usuario |
| `loading` | `Boolean` | Indicador de carga inicial |
| `showFormCol` | `String \| null` | Clave de la columna con el formulario abierto |

**Columnas del kanban:**

```js
const COLUMNS = [
  { key: "pendiente",   label: "Lista de tareas" },
  { key: "en_proceso",  label: "En proceso"      },
  { key: "completada",  label: "Hecho"            },
];
```

**Funciones principales:**

- `fetchTasks()` — Carga las tareas del usuario desde `GET /api/tasks` al montar el componente.
- `handleAddTask(newTask, colKey)` — Agrega optimísticamente una tarea nueva al estado local con el status de la columna donde se creó.
- `handleDeleteTask(taskId)` — Elimina una tarea con `DELETE /api/tasks/:id` y la remueve del estado.
- `handleStatusChange(task, newStatus)` — Cambia el status de una tarea con `PUT /api/tasks/:id` y actualiza el estado local sin recargar.
- `handleLogout()` — Limpia `localStorage` y redirige a login.

**Subcomponentes internos:**

`KanbanCard` — Renderiza una tarjeta individual dentro de una columna. Muestra título, descripción, badge de prioridad y, al hacer hover, botones de mover entre columnas y eliminar. Usa iconos SVG inline: `IconTask`, `IconFlag`, `IconArrow`, `IconTrash`.

---

### `TaskForm.jsx`

Formulario inline que aparece dentro de una columna al presionar `+`. Se cierra al agregar una tarea o cancelar.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `onTaskAdded` | `Function` | Callback que recibe la tarea creada |
| `onCancel` | `Function` | Callback para cerrar el formulario |
| `defaultStatus` | `String` | Status inicial de la tarea según la columna |

**Campos:**

- `titulo` (requerido, máx. 100 caracteres)
- `descripcion` (opcional, máx. 500 caracteres)
- `prioridad` (select: `baja` / `media` / `alta`, default `media`)

El formulario envía `estado: defaultStatus` al backend para que la tarea aparezca en la columna correcta desde el momento de creación.

---

## Comunicación con el backend

La URL base del backend es `http://localhost:3001`. Todos los endpoints de tareas requieren autenticación JWT.

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/auth/register` | Registro de usuario |
| `POST` | `/api/auth/login` | Login, devuelve token |
| `GET` | `/api/tasks` | Obtener todas las tareas del usuario |
| `POST` | `/api/tasks` | Crear una nueva tarea |
| `PUT` | `/api/tasks/:id` | Actualizar estado o datos de una tarea |
| `DELETE` | `/api/tasks/:id` | Eliminar una tarea |

**Notas sobre la API:**
- El backend devuelve las tareas bajo la clave `tareas` en el GET (ej: `{ tareas: [...] }`). El frontend soporta ambos formatos: `response.data.tareas || response.data`.
- Al crear una tarea, el backend devuelve la tarea bajo `{ tarea: {...} }`. El frontend soporta: `response.data.tarea || response.data`.
- Los campos de tarea usan nombres en español: `titulo`, `descripcion`, `prioridad`, `estado`.

---

## Diseño y estilos

El diseño está inspirado en el template **"Web Dashboard UI - Task & Project Management"** de la comunidad de Figma, adaptado a la identidad **Planify**.

**Paleta de colores principal:**

| Token | Valor | Uso |
|---|---|---|
| Background | `#ECF0F6` | Fondo general de la app |
| Surface | `#E4E9F4` | Fondo de columnas kanban |
| Card | `#FFFFFF` | Fondo de tarjetas |
| Border | `#DDE3EE` | Bordes y separadores |
| Accent | `#3B5BDB` | Color principal (botones, checkboxes, foco) |
| Text primary | `#1A1D23` | Títulos y texto principal |
| Text secondary | `#6B7280` | Descripciones y metadatos |

**Prioridades:**

| Nivel | Background | Color texto |
|---|---|---|
| Alta | `#FFE4E4` | `#C92A2A` |
| Media | `#FFF3CD` | `#B45309` |
| Baja | `#D3F9D8` | `#2B8A3E` |

**Sistema de espaciado:** todos los márgenes, paddings y gaps usan potencias de 2 en píxeles (4, 8, 16, 32, 64).

**Tipografía:** [Poppins](https://fonts.google.com/specimen/Poppins) (Google Fonts), pesos 400 / 500 / 600 / 700.

**Iconos:** SVG inline definidos como componentes funcionales de React dentro de `Dashboard.jsx`. Sin dependencias externas de iconografía.

---

## Scripts disponibles

```bash
npm start       # Inicia el servidor de desarrollo en localhost:3000
npm run build   # Genera el build de producción en /build
npm test        # Ejecuta los tests (configuración por defecto de CRA)
```

---

## Consideraciones para producción

- Reemplazar la URL hardcodeada `http://localhost:3001` por una variable de entorno (`REACT_APP_API_URL`) en todos los archivos que usan Axios.
- Agregar manejo de token expirado (interceptor de Axios con redirect a login en respuestas 401).
- El campo `name` en el registro se genera automáticamente desde el email; considerar agregar un campo de nombre real en el formulario.
