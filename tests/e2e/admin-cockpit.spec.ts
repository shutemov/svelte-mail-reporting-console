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

test('admin cockpit shows simulation snapshot and employee cards', async ({ page }) => {
  await reset(page, 'empty');
  await asAdmin(page);

  await page.goto('/admin');

  await expect(page.getByRole('heading', { name: 'Suspicious mail operations' })).toBeVisible();
  await expect(page.getByText('incoming in 15m')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Employee risk profiles' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Simulation snapshot' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open simulation console' })).toBeVisible();
  await expect(page.getByLabel('Suspicious mail workflow guide').getByRole('listitem')).toHaveCount(6);
  await expect(page.getByRole('link', { name: /1\. Simulate/ })).toHaveCount(0);
  await expect(page.getByLabel('Recommended next actions')).toBeVisible();
  await expect(page.getByText('Step 1 of 6')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Operator controls' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Workload profile' })).toHaveCount(0);

  await expect(page.getByRole('link', { name: /Alice Employee/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Bob Employee/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Carol Finance/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Julia Operations/ })).toBeVisible();
  await expect(page.getByText('Summary only')).toHaveCount(0);
});

test('all employee profile cards open profile details', async ({ page }) => {
  await reset(page, 'default');
  await asAdmin(page);

  await page.goto('/admin');
  await page.getByRole('link', { name: /Alice Employee/ }).click();

  await expect(page).toHaveURL(/\/admin\/employees\/employee-1$/);
  await expect(page.getByRole('heading', { name: 'Employee profile' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Risk action breakdown' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Reports' })).toBeVisible();

  await page.goto('/admin');
  await page.getByRole('link', { name: /Carol Finance/ }).click();

  await expect(page).toHaveURL(/\/admin\/employees\/employee-3$/);
  await expect(page.getByRole('heading', { name: 'Employee profile' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Reports' })).toBeVisible();
});

test('inject once updates dashboard workload and employee summaries', async ({ page }) => {
  await reset(page, 'empty');
  await asAdmin(page);

  await page.goto('/admin/simulation');
  await page.getByRole('button', { name: 'Inject once' }).click();

  await page.goto('/admin');
  const snapshot = page.getByLabel('Simulation snapshot');
  await expect(page.getByText('paused', { exact: true })).toBeVisible();
  await expect(snapshot.getByLabel('Generated cases').getByText('1')).toBeVisible();
  await expect(page.getByText('Risky reports')).toBeVisible();
  await expect(page.getByText('1 reports')).toBeVisible();
});
