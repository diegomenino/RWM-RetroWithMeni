import { test, expect } from '@playwright/test';

const E2E_USERNAME = 'admin@example.com';
const E2E_PASSWORD = 'password123';

test.describe('RWM E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Check if we are redirected to login
    if (page.url().includes('/login')) {
      await page.fill('input[type="email"]', E2E_USERNAME);
      await page.fill('input[type="password"]', E2E_PASSWORD);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/.*home/, { timeout: 15000 });
    }
  });

  test('should load the home page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'RWM', exact: true })).toBeVisible();
  });

  test('should complete a full retrospective workflow', async ({ page }) => {
    const sessionName = 'E2E Full Retro ' + Date.now();

    // 1. Create Session
    const nameInput = page.locator('input[required][maxLength="100"]');
    await nameInput.waitFor({ state: 'visible' });
    await nameInput.fill(sessionName);
    await page.click('button:has-text("Create Session")');

    await expect(page).toHaveURL(/.*session\/.*/, { timeout: 15000 });
    await expect(page.getByRole('heading', { name: sessionName })).toBeVisible();

    // 2. Write Phase: Add a card
    const cardContent = 'E2E Test Card ' + Date.now();
    await page.click('button:has-text("Add card")');
    await page.fill('textarea', cardContent);
    await page.click('button:has-text("Add card")');
    await expect(page.getByText(cardContent)).toBeVisible();

    // 3. Test Timer
    // Use more specific role and name
    const startBtn = page.getByRole('button', { name: /^Start$/, exact: true });
    await startBtn.click();
    const stopBtn = page.getByRole('button', { name: /^Stop$/, exact: true });
    await expect(stopBtn).toBeVisible();
    await stopBtn.click();
    await expect(startBtn).toBeVisible();

    // 4. Advance to Vote Phase
    await page.click('button:has-text("Reveal & Start Voting")');
    await expect(page.locator('span:has-text("Vote")')).toBeVisible();

    // 5. Vote for the card
    const voteBtn = page.locator('button[title="Vote for this card"]');
    await voteBtn.waitFor({ state: 'visible' });
    await voteBtn.click();
    await expect(page.locator('button[title="Remove vote"]')).toBeVisible();

    // 6. Advance to Discuss Phase
    await page.click('button:has-text("Start Discussion")');
    await expect(page.locator('span:has-text("Discuss")')).toBeVisible();

    // 7. Advance to Done Phase
    await page.click('button:has-text("Finish Session")');
    await expect(page.locator('span:has-text("Done")')).toBeVisible();
    await expect(page.getByText('Retrospective Complete!')).toBeVisible();
  });
});
