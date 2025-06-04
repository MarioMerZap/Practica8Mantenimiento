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
		await page.goto('http://localhost:4200/');

		await page.locator('input[name="nombre"]').type('Manuel');
		await page.locator('input[name="DNI"]').type('123');

		const submitButton = page.locator('button[name="login"]');

		await Promise.all([page.waitForNavigation(), submitButton.click()]);

		await check(page.locator('h2'), {
			header: async (lo) => (await lo.textContent()) == 'Listado de pacientes',
		})
	} finally {
		await page.close();
	}
}