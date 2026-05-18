import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  reporter: 'html',
  use: {
    // ESTA ES LA CLAVE: Usa el Google Chrome instalado en tu sistema
    channel: 'chrome', 
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    headless: false, // Para que veas el navegador abrirse y moverse solo
  },
});
