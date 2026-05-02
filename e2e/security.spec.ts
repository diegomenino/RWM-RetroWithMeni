import { test, expect } from '@playwright/test';

test.describe('Security Tests', () => {
  test('unauthenticated user should be redirected to login', async ({ page }) => {
    await page.goto('/home');
    await expect(page).toHaveURL(/.*login/);

    await page.goto('/admin');
    await expect(page).toHaveURL(/.*login/);
  });

  test('non-admin user should not be able to access admin panel', async ({ page }) => {
    // Login as regular user
    await page.goto('/login');
    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*home/);

    // Try to access admin panel
    await page.goto('/admin');
    // It should redirect back to home or show 403
    // Based on AdminPage.tsx, it redirects to /home if 403
    await expect(page).toHaveURL(/.*home/);
  });

  test('disabled user should not be able to log in', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'disabled@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.getByText(/Account is disabled/i)).toBeVisible();
    await expect(page).toHaveURL(/.*login/);
  });
});
