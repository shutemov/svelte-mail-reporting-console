import { expect, test } from '@playwright/test';

test.skip(({ browserName }) => browserName === 'webkit', 'WebKit datetime-local submit is flaky');

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
  await page.locator('input[name="receivedAt"]').fill('2026-01-11T15:30');
  await page.getByLabel('Reason').fill('Potential credential harvesting email.');
  await page.locator('input[name="riskyActions"][value="clicked_link"]').check();
  await page.getByRole('button', { name: 'Submit report' }).click();
  await expect(page.getByText('Injected failure')).toBeVisible();

  await page.getByRole('button', { name: 'Submit report' }).click();
  await expect(page).toHaveURL(/\/employee\/reports\//);
});
