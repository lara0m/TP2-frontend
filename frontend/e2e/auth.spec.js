import { test, expect } from '@playwright/test';

test('usuario puede registrarse y luego iniciar sesión', async ({ page }) => {
  // Generamos un email único para no repetir usuarios
  const email = `test${Date.now()}@gmail.com`;
  const password = 'test123';

  // 1. Ir a la página de registro
  await page.goto('/register');
  await expect(page).toHaveTitle(/Planify/);

  // 2. Llenar el formulario de registro
  await page.fill('input[type="email"]', email);
  await page.fill('input[id="password"]', password);
  await page.fill('input[id="confirmPassword"]', password);
  await page.click('button[type="submit"]');

  // 3. Verificar mensaje de éxito y redirección al login
  await expect(page.locator('.success-message')).toBeVisible();
  await page.waitForURL('**/login');

  // 4. Hacer login con las mismas credenciales
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');

  // 5. Verificar que llegamos al dashboard
  await page.waitForURL('**/dashboard');
  await expect(page.locator('text=Lista de tareas')).toBeVisible();
});