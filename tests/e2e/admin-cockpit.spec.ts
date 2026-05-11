import { expect, test } from '@playwright/test';

async function reset(page: import('@playwright/test').Page, seed: 'default' | 'empty' = 'empty') {
  await page.request.post('/api/test/reset', { data: { seed } });
}

async function asAdmin(page: import('@playwright/test').Page) {
  await page.context().addCookies([
    {
      name: 'demo_user_id',
      value: 'admin-1',
      domain: '127.0.0.1',
      path: '/'
    }
  ]);
}

test('admin cockpit shows simulation controls and employee cards', async ({ page }) => {
  await reset(page, 'empty');
  await asAdmin(page);

  await page.goto('/admin');

  await expect(page.getByRole('heading', { name: 'Admin dashboard' })).toBeVisible();
  await expect(page.getByText('Incoming reports 15m')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Employee risk profiles' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Simulation controls' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Flow settings' })).toBeVisible();

  await expect(page.getByRole('link', { name: /Alice Employee/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Bob Employee/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Carol Finance/ })).toHaveCount(0);
  await expect(page.getByText('Summary only')).toHaveCount(8);
});

test('profile-enabled employees have details and summary-only employees do not', async ({ page }) => {
  await reset(page, 'default');
  await asAdmin(page);

  await page.goto('/admin');
  await page.getByRole('link', { name: /Alice Employee/ }).click();

  await expect(page).toHaveURL(/\/admin\/employees\/employee-1$/);
  await expect(page.getByRole('heading', { name: 'Employee profile' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Risk action breakdown' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Reports' })).toBeVisible();

  const response = await page.goto('/admin/employees/employee-3');
  expect(response?.status()).toBe(404);
});

test('inject once updates dashboard workload and employee summaries', async ({ page }) => {
  await reset(page, 'empty');
  await asAdmin(page);

  await page.goto('/admin');
  await page.getByRole('button', { name: 'Inject once' }).click();

  await expect(page.getByText('Mode: paused')).toBeVisible();
  await expect(page.getByText('Generated:')).toBeVisible();
  await expect(page.getByText('High-risk reports')).toBeVisible();
  await expect(page.getByText('1 reports')).toBeVisible();
});
