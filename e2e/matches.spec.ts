import { test, expect } from '@playwright/test';

test.describe('Matches Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the matches page
    await page.goto('/matches');
  });

  test('displays matches list', async ({ page }) => {
    // Wait for matches to load
    await expect(page.getByTestId('matches-list')).toBeVisible();

    // Check if at least one match card is present
    const matchCards = page.getByTestId('match-card');
    await expect(matchCards.first()).toBeVisible();
  });

  test('filters matches by date', async ({ page }) => {
    // Get the date picker
    const datePicker = page.getByTestId('date-picker');
    await expect(datePicker).toBeVisible();

    // Select tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await datePicker.fill(tomorrow.toISOString().split('T')[0]);

    // Check if matches are updated
    await expect(page.getByTestId('matches-list')).toBeVisible();
  });

  test('displays match details', async ({ page }) => {
    // Click on the first match card
    const firstMatchCard = page.getByTestId('match-card').first();
    await firstMatchCard.click();

    // Check if match details are displayed
    await expect(page.getByTestId('match-details')).toBeVisible();
    await expect(page.getByTestId('team-stats')).toBeVisible();
    await expect(page.getByTestId('odds-panel')).toBeVisible();
  });

  test('handles error states', async ({ page }) => {
    // Simulate network error
    await page.route('**/api/matches**', (route) => {
      route.fulfill({
        status: 500,
        body: 'Server error',
      });
    });

    // Reload the page
    await page.reload();

    // Check if error message is displayed
    await expect(page.getByTestId('error-message')).toBeVisible();
  });
});

test.describe('Predictions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/predictions');
  });

  test('creates new prediction', async ({ page }) => {
    // Click on create prediction button
    await page.getByTestId('create-prediction-btn').click();

    // Select a match
    await page.getByTestId('match-select').click();
    await page.getByTestId('match-option').first().click();

    // Fill prediction details
    await page.getByTestId('prediction-form').fill({
      confidence: '80',
      notes: 'Test prediction',
    });

    // Submit the form
    await page.getByTestId('submit-prediction').click();

    // Check if success message is shown
    await expect(page.getByTestId('success-message')).toBeVisible();
  });

  test('displays prediction history', async ({ page }) => {
    // Check if prediction history is loaded
    await expect(page.getByTestId('prediction-history')).toBeVisible();

    // Verify prediction cards are present
    const predictionCards = page.getByTestId('prediction-card');
    await expect(predictionCards.first()).toBeVisible();
  });
});