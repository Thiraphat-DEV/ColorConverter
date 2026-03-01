import { test, expect } from '@playwright/test';

test.describe('Color Converter', () => {
	test('page loads with title', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('heading', { name: /color converter/i })).toBeVisible();
	});

	test('shows input and format section', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByLabel(/ค่าสี/i)).toBeVisible();
		await expect(page.getByRole('heading', { name: /เลือกรูปแบบ/i })).toBeVisible();
	});

	test('entering hex color shows preview and results', async ({ page }) => {
		await page.goto('/');
		const input = page.getByPlaceholder(/ff5500/i);
		await input.fill('#ff5500');
		await expect(page.locator('.preview.preview-visible')).toBeVisible();
		await expect(page.getByText('0xFF5500').first()).toBeVisible({ timeout: 2000 });
	});

	test('common color chips fill input', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /แดง/i }).click();
		await expect(page.getByDisplayValue('#ef4444')).toBeVisible();
		await page.getByRole('button', { name: /เขียว/i }).click();
		await expect(page.getByDisplayValue('#22c55e')).toBeVisible();
	});

	test('copy button shows feedback', async ({ page }) => {
		await page.goto('/');
		await page.getByPlaceholder(/ff5500/i).fill('#ff5500');
		await expect(page.getByText('0xFF5500').first()).toBeVisible({ timeout: 2000 });
		const copyBtn = page.getByRole('button', { name: /copy/i }).first();
		await copyBtn.click();
		await expect(page.getByText(/คัดลอกแล้ว/i).first()).toBeVisible({ timeout: 500 });
	});

	test('invalid input shows error hint', async ({ page }) => {
		await page.goto('/');
		await page.getByPlaceholder(/ff5500/i).fill('notacolor');
		await expect(page.getByText(/รูปแบบไม่รู้จัก/i)).toBeVisible();
	});
});
