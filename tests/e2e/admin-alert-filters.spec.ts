import { expect, test } from '@playwright/test';

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

test('admin alert filters survive reload via URL params', async ({ page }) => {
  await page.request.post('/api/test/reset', { data: { seed: 'default' } });
  await asAdmin(page);

  await page.goto('/admin/alerts?status=investigating&severity=high&riskyAction=clicked_link');
  await expect(page).toHaveURL(/status=investigating/);

  await page.reload();
  await expect(page).toHaveURL(/severity=high/);
  await expect(page.getByText('Urgent action required')).toBeVisible();
});

test('admin alert filters apply from queue form with empty fields', async ({ page }) => {
  await page.request.post('/api/test/reset', { data: { seed: 'default' } });
  await asAdmin(page);

  await page.goto('/admin/alerts');
  await page.getByRole('combobox').nth(1).selectOption('high');
  await page.getByRole('button', { name: 'Apply filters' }).click();

  await expect(page).toHaveURL(/severity=high/);
  await expect(page.getByText('Urgent action required')).toBeVisible();
});

test('admin can open an alert by clicking anywhere on the row', async ({ page }) => {
  await page.request.post('/api/test/reset', { data: { seed: 'default' } });
  await asAdmin(page);

  await page.goto('/admin/alerts');
  await page.getByText('suspicious@mailer.biz').click();

  await expect(page).toHaveURL(/\/admin\/alerts\/alert-1$/);
  await expect(page.getByRole('heading', { name: 'Urgent action required' })).toBeVisible();
});
