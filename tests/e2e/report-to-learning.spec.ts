import { expect, test } from '@playwright/test';

test.skip(({ browserName }) => browserName === 'webkit', 'WebKit cookie role switching is flaky');

async function reset(page: import('@playwright/test').Page, seed: 'default' | 'empty' = 'default') {
  await page.request.post('/api/test/reset', { data: { seed } });
}

async function switchRole(page: import('@playwright/test').Page, userId: string) {
  await page.context().addCookies([
    {
      name: 'demo_user_id',
      value: userId,
      domain: '127.0.0.1',
      path: '/'
    }
  ]);
}

test('primary report-to-learning workflow', async ({ page }) => {
  await reset(page, 'empty');
  await switchRole(page, 'employee-1');

  await page.goto('/employee/report');
  await page.getByLabel('Sender').fill('phisher@example.com');
  await page.getByLabel('Subject').fill('Verify account now');
  await page.getByLabel('Received date').fill('11.01.2026');
  await page.getByLabel('Received time').fill('15:30');
  await page.getByLabel('Reason').fill('Sender requested password reset on external domain.');
  await page.locator('input[name="riskyActions"][value="entered_credentials"]').check();
  await page.getByRole('button', { name: 'Submit report' }).click();

  await expect(page).toHaveURL(/\/employee\/reports\//);

  await switchRole(page, 'admin-1');
  await page.goto('/admin/alerts');
  await page.getByRole('link', { name: 'Verify account now' }).click();
  await page.getByRole('button', { name: 'Resolve malicious' }).click();
  await page.getByRole('button', { name: 'Assign follow-up learning' }).click();

  await switchRole(page, 'employee-1');
  await page.goto('/employee/learning');
  await page.getByRole('link', { name: /Phishing basics/i }).click();
  await page.getByRole('button', { name: 'Mark as completed' }).click();

  await switchRole(page, 'admin-1');
  await page.goto('/admin');
  await expect(page.locator('.metric-group.remediation').getByText('100%')).toBeVisible();
});
