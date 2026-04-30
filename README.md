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