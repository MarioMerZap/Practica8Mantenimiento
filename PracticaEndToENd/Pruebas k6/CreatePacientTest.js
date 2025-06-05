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
    // 1. Ir al login
    await page.goto('http://localhost:4200/');
    await page.locator('input[name="nombre"]').type('Manuel');
    await page.locator('input[name="DNI"]').type('123');
    await Promise.all([
      page.waitForNavigation(),
      page.locator('button[name="login"]').click(),
    ]);

    // 2. Confirmar que estamos en el listado de pacientes
    await check(page.locator('h2'), {
      'Listado de pacientes visible': async (h2) =>
        (await h2.textContent()).includes('Listado de pacientes'),
    });

    // 3. Hacer clic en el botón de "Crear paciente"
    await page.locator('button:has-text("Crear Paciente")').click();

    // 4. Rellenar el formulario
    const nombrePaciente = 'PacienteK6_' + Math.floor(Math.random() * 10000);
    await page.locator('input[name="dni"]').type('99999999X');
    await page.locator('input[name="nombre"]').type(nombrePaciente);
    await page.locator('input[name="edad"]').type('45');
    await page.locator('input[name="cita"]').type('2025-06-10');

    // 5. Enviar el formulario
    await Promise.all([
      page.waitForNavigation(),
      page.locator('button:has-text("Create")').click(),
    ]);

    // 6. Confirmar que estamos de vuelta en el listado y que el paciente aparece
    await check(page.locator('body'), {
      [`Paciente ${nombrePaciente} aparece en el listado`]: async (body) =>
        (await body.textContent()).includes(nombrePaciente),
    });

  } finally {
    await page.close();
  }
}
