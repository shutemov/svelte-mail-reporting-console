import { expect, test } from '@playwright/test';

test('risky action labels toggle only their own checkbox', async ({ page }) => {
  await page.request.post('/api/test/reset', { data: { seed: 'empty' } });

  await page.goto('/employee/report');

  const openedEmail = page.locator('input[name="riskyActions"][value="opened_email"]');
  const clickedLink = page.locator('input[name="riskyActions"][value="clicked_link"]');
  const downloadedAttachment = page.locator('input[name="riskyActions"][value="downloaded_attachment"]');

  await page.getByText('Opened email', { exact: true }).click();
  await expect(openedEmail).toBeChecked();
  await expect(clickedLink).not.toBeChecked();
  await expect(downloadedAttachment).not.toBeChecked();

  await page.getByText('Clicked link', { exact: true }).click();
  await expect(openedEmail).toBeChecked();
  await expect(clickedLink).toBeChecked();
  await expect(downloadedAttachment).not.toBeChecked();

  await page.getByText('Downloaded attachment', { exact: true }).click();
  await expect(openedEmail).toBeChecked();
  await expect(clickedLink).toBeChecked();
  await expect(downloadedAttachment).toBeChecked();
});
