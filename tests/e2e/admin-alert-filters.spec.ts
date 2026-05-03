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