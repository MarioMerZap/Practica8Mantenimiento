import { browser } from 'k6/browser';
import { check, sleep } from 'https://jslib.k6.io/k6-utils/1.5.0/index.js';

export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    checks: ['rate==1.0'],
  },
};

export default async function () {
  const page = await browser.newPage();

  try {
    // 1. Login
    await page.goto('http://localhost:4200/');
    await page.locator('input[name="nombre"]').type('Manuel');
    await page.locator('input[name="DNI"]').type('123');
    await Promise.all([
      page.waitForNavigation(),
      page.locator('button[name="login"]').click(),
    ]);

    // 2. Ir directamente a la imagen del paciente (ajusta ID real aquí)
    await page.goto('http://localhost:4200/imagen/1');

    // 3. Esperar que aparezca el botón de predecir
    const predictBtn = page.locator('button:has-text("Predecir")');
    await predictBtn.waitFor();

    // 4. Hacer clic en predecir
    await predictBtn.click();

    // 5. Esperar a que aparezca la predicción (hasta 5s máx)
    const resultLocator = page.locator('div.result');
    await resultLocator.waitFor({ timeout: 5000 });

    // 6. Verificar que contiene "Probabilidad de cáncer:"
    await check(resultLocator, {
      'Predicción de IA mostrada': async (el) =>
        (await el.textContent()).includes('Probabilidad de cáncer:'),
    });

  } finally {
    await page.close();
  }
}
