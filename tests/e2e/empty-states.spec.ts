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

test('empty state coverage', async ({ page }) => {
  await page.request.post('/api/test/reset', { data: { seed: 'empty' } });

  await page.goto('/employee/reports');
  await expect(page.getByText('No reports yet.')).toBeVisible();

  await page.goto('/employee/learning');
  await expect(page.getByText('No learning assignments yet.')).toBeVisible();

  await asAdmin(page);
  await page.goto('/admin/alerts');
  await expect(page.getByText('No alerts found for current filter.')).toBeVisible();
});