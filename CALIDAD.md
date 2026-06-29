# CALIDAD.md — Planify

## Estrategia general

La estrategia de calidad que elegimos se basa en validar el código en tres niveles antes de que llegue a producción: primero verificamos que el código esté bien escrito (lint), después probamos la lógica de negocio de forma aislada (tests unitarios), y finalmente simulamos el comportamiento real de un usuario en el navegador (test E2E). Solo si los tres niveles pasan, el código se construye y se deploya automáticamente a Vercel.

El razonamiento detrás de este enfoque es que cada nivel atrapa un tipo de error distinto. El lint atrapa problemas de sintaxis y estilo sin ejecutar nada. Los tests unitarios verifican que las funciones críticas se comporten como esperamos. El test E2E verifica que todo el sistema funcione junto, desde el navegador hasta la base de datos.

## Herramientas seleccionadas

**Vitest** — lo elegimos para los tests unitarios porque es moderno y rápido. Consideramos Jest, que hubiera funcionado igual para nuestro caso, pero Vitest tiene mejor integración con el ecosistema actual de JavaScript y la configuración resultó más simple.

**Playwright** — lo elegimos para los tests E2E porque es gratuito, soporta múltiples navegadores y lenguajes, y tiene buena documentación. Evaluamos Cypress pero lo descartamos porque es más lento y su versión completa requiere pago.

**ESLint** — lo usamos para mantener consistencia en el código y detectar errores simples antes de correr los tests. Usamos la configuración de `react-app` que ya viene preparada para proyectos React, lo que nos evitó configurar reglas desde cero.

**GitHub Actions** — lo elegimos para CI/CD porque está integrado directamente en GitHub, donde ya teníamos el repositorio. No requiere configurar ningún servicio externo adicional.

## Tests desarrollados

### Tests unitarios (`src/utils/validacion.test.js`)

**1. Contraseñas no coinciden**
Valida que el sistema detecte cuando el usuario ingresa dos contraseñas distintas en el formulario de registro. Esto protege que un mismo usuario no pueda registrarse con contraseñas inconsistentes, lo que rompería el login posterior.

**2. Contraseña menor a 6 caracteres**
Valida que no se acepten contraseñas demasiado cortas. Esto existe para que todas las contraseñas guardadas en la base de datos tengan una longitud mínima consistente.

**3. Registro exitoso**
Valida el caso donde todo está bien: las contraseñas coinciden y tienen al menos 6 caracteres. Es importante testear el caso exitoso porque sin él no podemos saber si la función realmente aprueba cuando debe aprobar, o si está rechazando todo.

**4. Generación de nombre desde email**
Valida que a partir de un email como `lara@gmail.com` se genere automáticamente el nombre de usuario `lara`. Esta es una decisión de negocio de la aplicación: el nombre se crea solo a partir del email, sin pedírselo al usuario.

### Test E2E (`e2e/auth.spec.js`)

**Flujo completo de registro y login**
El test simula un usuario real que llega a la aplicación por primera vez. Genera un email único, completa el formulario de registro, verifica que aparezca el mensaje de éxito y que sea redirigido al login. Luego ingresa las mismas credenciales en el login y verifica que llegue al dashboard donde puede ver el tablero de tareas. Este test cubre el flujo más crítico de la aplicación de punta a punta.

## Casos de uso críticos

Los flujos que priorizamos proteger con tests son el registro y el login, porque son la puerta de entrada a toda la aplicación. Si las validaciones del registro fallan, un usuario podría crearse con datos inválidos y después no poder loguearse. Más importante aún: si una validación falla silenciosamente sin interrumpir el flujo, el sistema podría aceptar cualquier dato como válido, lo que comprometería la seguridad de todos los usuarios y sus tareas.

También es crítico que cada usuario solo vea sus propias tareas. Esto lo maneja el backend mediante JWT, pero el test E2E verifica indirectamente que el sistema de autenticación funcione de punta a punta.

## Pipeline de CI/CD

El pipeline se dispara en cada push o pull request a `main` y tiene cinco etapas encadenadas:

1. **Lint** — verifica que el código no tenga errores de sintaxis ni malas prácticas. Va primero porque es el chequeo más rápido (segundos). Si hay un error obvio, no tiene sentido gastar tiempo corriendo todos los tests.

2. **Unit Tests** — corre los tests unitarios con Vitest. Va después del lint porque si el código ni siquiera pasa el análisis estático, no vale la pena ejecutarlo.

3. **E2E Tests** — corre el test de Playwright que simula el flujo completo en un navegador real. Va después de los unitarios porque es el chequeo más costoso en tiempo.

4. **Build** — construye la aplicación para producción. Solo se ejecuta si todos los tests pasaron.

5. **Deploy to Vercel** — deploya la versión construida a producción. Solo ocurre en pushes directos a `main`, no en pull requests. Esta decisión es intencional: `main` es la rama de producción, lo que los usuarios ven. No queremos deployar ramas de features que pueden tener código incompleto.

La cadena de dependencias se implementa con `needs:` en cada job, lo que garantiza que si cualquier etapa falla, todo el pipeline se detiene y el deploy no ocurre.

## Limitaciones y deuda técnica

La cobertura de tests actual se limita al flujo de autenticación. Quedaron sin cubrir componentes importantes como el Dashboard, el TaskForm, y el Login. En particular, no testeamos el cambio de estado de las tareas entre columnas del kanban, que es la funcionalidad central de la aplicación.

Con más tiempo, mejoraríamos la cobertura para testear absolutamente toda la aplicación: crear una tarea, moverla entre columnas, eliminarla, y verificar que persista correctamente en la base de datos. También agregaríamos tests para los casos de error del login (credenciales incorrectas, usuario inexistente) y para el comportamiento de la app cuando el backend no responde.