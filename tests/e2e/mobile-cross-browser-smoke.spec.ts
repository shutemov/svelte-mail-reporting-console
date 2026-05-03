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

test('mobile and cross-browser smoke paths', async ({ page }) => {
  await page.request.post('/api/test/reset', { data: { seed: 'default' } });

  await page.goto('/employee/report');
  await expect(page.getByRole('heading', { name: 'Report suspicious mail' })).toBeVisible();

  await asAdmin(page);
  await page.goto('/admin/alerts');
  await expect(page.getByRole('heading', { name: 'Alert queue' })).toBeVisible();

  await page.getByRole('link', { name: 'Urgent action required' }).click();
  await expect(page.getByRole('heading', { name: 'Alert details' })).toBeVisible();
});