import { expect, test } from '@playwright/test';

test('report validation and retry after controlled failure', async ({ page }) => {
  await page.request.post('/api/test/reset', { data: { seed: 'empty' } });

  await page.goto('/employee/report');
  await page.getByRole('button', { name: 'Submit report' }).click();
  await expect(page.getByRole('alert').first()).toBeVisible();

  await page.request.post('/api/test/fail-next', {
    data: {
      command: 'submitReport',
      status: 500,
      message: 'Injected failure'
    }
  });

  await page.getByLabel('Sender').fill('phisher@example.com');
  await page.getByLabel('Subject').fill('Alert subject');
  await page.getByLabel('Received date').fill('11.01.2026');
  await page.getByLabel('Received time').fill('15:30');
  await page.getByLabel('Reason').fill('Potential credential harvesting email.');
  await page.locator('input[name="riskyActions"][value="clicked_link"]').check();
  await page.getByRole('button', { name: 'Submit report' }).click();
  await expect(page.getByText('Injected failure')).toBeVisible();

  await page.getByRole('button', { name: 'Submit report' }).click();
  await expect(page).toHaveURL(/\/employee\/reports\//);
});
