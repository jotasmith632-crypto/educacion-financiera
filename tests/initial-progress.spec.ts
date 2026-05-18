import { test, expect } from '@playwright/test';

test('crear cuenta nueva y verificar progreso inicial en 0', async ({ page }) => {
  const timestamp = Date.now();
  const testEmail = `test_${timestamp}@example.com`;
  const testName = `Estudiante Prueba ${timestamp}`;

  // 1. Ir a la aplicación
  await page.goto('http://localhost:5173');

  // 2. Saltar Onboarding
  // Pantalla 1
  await page.getByRole('button', { name: /Siguiente/i }).click();
  // Pantalla 2
  await page.getByRole('button', { name: /Siguiente/i }).click();
  // Pantalla 3
  await page.getByRole('button', { name: /Comenzar/i }).click();

  // 3. Llenar formulario de registro
  await page.getByPlaceholder('Tu nombre').fill(testName);
  await page.getByPlaceholder('tu@email.com').fill(testEmail);
  await page.getByPlaceholder('Mínimo 6 caracteres').fill('password123');
  await page.getByPlaceholder('Nombre de tu colegio').fill('Colegio Playwright');
  
  await page.locator('select').selectOption('1'); // 1° Sec
  await page.getByPlaceholder('Tu distrito').fill('Distrito QA');

  // Enviar registro
  await page.getByRole('button', { name: 'Registrarse', exact: true }).click();

  // 4. Verificar que llegamos al Home y el progreso es 0
  // Esperamos a que aparezca el nombre del usuario
  await expect(page.getByText(`Hola, ${testName}`)).toBeVisible({ timeout: 10000 });

  // Verificar Puntos
  const points = page.locator('.grid-cols-3 > div').nth(0).locator('p.text-2xl');
  await expect(points).toHaveText('0');

  // Verificar Nivel
  const level = page.locator('.grid-cols-3 > div').nth(1).locator('p.text-2xl');
  await expect(level).toHaveText('0');

  // Verificar Olimpiadas %
  const olympics = page.locator('.grid-cols-3 > div').nth(2).locator('p.text-2xl');
  await expect(olympics).toHaveText('0%');

  console.log('✅ Test completado: La cuenta inicia correctamente con 0 puntos y Nivel 0.');
});
