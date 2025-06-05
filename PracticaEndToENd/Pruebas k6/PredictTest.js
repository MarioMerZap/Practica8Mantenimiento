import { browser } from 'k6/browser';
import { check } from 'https://jslib.k6.io/k6-utils/1.5.0/index.js';

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
    // Abre la página de login
    await page.goto('http://localhost:4200/');

    // Loguear con médico existente
    await page.locator('input[name="nombre"]').type('Manuel');
    await page.locator('input[name="DNI"]').type('123');
    const submitButton = page.locator('button[name="login"]');
    await Promise.all([page.waitForNavigation(), submitButton.click()]);

    // Comprobar que aparece el listado de pacientes
    await check(page.locator('h2'), {
      header: async (lo) => (await lo.textContent()) === 'Listado de pacientes',
    });

    // Navegar a la página de la imagen con ID que no sé cual es, corregir el ID
    await page.goto('http://localhost:4200/imagen/1');

    // Pulsar el botón de predecir
    const predictBtn = page.locator('button.predict-button');
    await predictBtn.click();

    // Comprobar que la predicción aparece en la página
    await check(page.locator('.result'), {
      predictionShown: async (el) => (await el.textContent()).includes('Probabilidad de cáncer'),
    });
  } finally {
    await page.close();
  }
}
