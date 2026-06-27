# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> usuario puede registrarse y luego iniciar sesión
- Location: e2e\auth.spec.js:3:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.success-message')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.success-message')

```

```yaml
- heading "Registrarse" [level=2]
- text: Error al registrar usuario Correo Electrónico
- textbox "Correo Electrónico":
  - /placeholder: tu@email.com
  - text: test1782601953386@gmail.com
- text: Contraseña
- textbox "Contraseña":
  - /placeholder: Mínimo 6 caracteres
  - text: test123
- text: Confirmar Contraseña
- textbox "Confirmar Contraseña":
  - /placeholder: Repite tu contraseña
  - text: test123
- button "Registrarse"
- paragraph:
  - text: ¿Ya tienes cuenta?
  - link "Inicia sesión aquí":
    - /url: /login
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('usuario puede registrarse y luego iniciar sesión', async ({ page }) => {
  4  |   // Generamos un email único para no repetir usuarios
  5  |   const email = `test${Date.now()}@gmail.com`;
  6  |   const password = 'test123';
  7  | 
  8  |   // 1. Ir a la página de registro
  9  |   await page.goto('/register');
  10 |   await expect(page).toHaveTitle(/Planify/);
  11 | 
  12 |   // 2. Llenar el formulario de registro
  13 |   await page.fill('input[type="email"]', email);
  14 |   await page.fill('input[id="password"]', password);
  15 |   await page.fill('input[id="confirmPassword"]', password);
  16 |   await page.click('button[type="submit"]');
  17 | 
  18 |   // 3. Verificar mensaje de éxito y redirección al login
> 19 |   await expect(page.locator('.success-message')).toBeVisible();
     |                                                  ^ Error: expect(locator).toBeVisible() failed
  20 |   await page.waitForURL('**/login');
  21 | 
  22 |   // 4. Hacer login con las mismas credenciales
  23 |   await page.fill('input[type="email"]', email);
  24 |   await page.fill('input[type="password"]', password);
  25 |   await page.click('button[type="submit"]');
  26 | 
  27 |   // 5. Verificar que llegamos al dashboard
  28 |   await page.waitForURL('**/dashboard');
  29 |   await expect(page.locator('text=Lista de tareas')).toBeVisible();
  30 | });
```