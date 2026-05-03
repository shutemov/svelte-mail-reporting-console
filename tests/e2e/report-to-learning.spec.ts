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
  await page.locator('input[name="receivedAt"]').evaluate((node) => {
    const input = node as HTMLInputElement;
    input.value = '2026-01-11T15:30';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.getByLabel('Reason').fill('Sender requested password reset on external domain.');
  await page.locator('input[name="riskyActions"][value="entered_credentials"]').check();
  await page.getByRole('button', { name: 'Submit report' }).click();

  await expect(page).toHaveURL(/\/employee\/reports\//);

  await switchRole(page, 'admin-1');
  await page.goto('/admin/alerts');
  await page.getByRole('link', { name: 'Verify account now' }).click();
  await page.getByRole('button', { name: 'Resolve as malicious' }).click();
  await page.getByRole('button', { name: 'Assign phishing basics' }).click();

  await switchRole(page, 'employee-1');
  await page.goto('/employee/learning');
  await page.getByRole('link', { name: 'Phishing Basics' }).click();
  await page.getByRole('button', { name: 'Mark as completed' }).click();

  await switchRole(page, 'admin-1');
  await page.goto('/admin');
  await expect(page.getByText('Learning completion (%)')).toBeVisible();
});
