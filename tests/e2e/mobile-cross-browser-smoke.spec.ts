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
  await expect(page.getByRole('heading', { name: 'Submit a suspicious message.' })).toBeVisible();

  await asAdmin(page);
  await page.goto('/admin/alerts');
  await expect(page.getByRole('heading', { name: 'Prioritize suspicious mail alerts.' })).toBeVisible();

  await page.getByRole('link', { name: 'Urgent action required' }).click();
  await expect(page.getByRole('heading', { name: 'Urgent action required' })).toBeVisible();
});
