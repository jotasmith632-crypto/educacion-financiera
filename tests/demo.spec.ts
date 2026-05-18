import { test, expect } from '@playwright/test';

test('Verificar progreso inicial en 0', async ({ page }) => {
  // 1. Navega a tu app local
  await page.goto('http://localhost:5173');

  // 2. Espera 2 segundos para ver la pantalla
  await page.waitForTimeout(2000);
  
  console.log('¡El navegador local se abrió correctamente!');
});
