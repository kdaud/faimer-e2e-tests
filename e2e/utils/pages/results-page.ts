import { expect, type Page } from '@playwright/test';

export class ResultsPage {
  constructor(readonly page: Page) {}

  async navigateToResultsPage() {
    await this.page.getByRole('link', { name: /results/i }).click();
    await expect(this.page.getByText(/imaging/i).nth(0)).toBeVisible();
    await expect(this.page.getByText(/hematology/i).nth(0)).toBeVisible();
    await expect(this.page.getByText(/bloodwork/i).nth(0)).toBeVisible();
  }

  async navigateToOverTimeView() {
    await this.page.getByRole('tab', { name: /over time/i }).click();
  }

  async navigateToIndividualTestsView() {
    await this.page.getByRole('tab', { name: /individual tests/i }).click();
  }
}
