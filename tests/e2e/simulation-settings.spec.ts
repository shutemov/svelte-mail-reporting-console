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

test('severity mix bar updates while editing and supports wheel input', async ({ page }) => {
  await page.request.post('/api/test/reset', { data: { seed: 'empty' } });
  await asAdmin(page);

  await page.goto('/admin/simulation');

  const lowInput = page.getByRole('spinbutton', { name: 'Low' });
  await lowInput.fill('25');

  await expect(page.getByText('Total 105% - reduce by 5%')).toBeVisible();

  await lowInput.dispatchEvent('wheel', { deltaY: 100 });

  await expect(lowInput).toHaveValue('24');
  await expect(page.getByText('Total 104% - reduce by 4%')).toBeVisible();
});
