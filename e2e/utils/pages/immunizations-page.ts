import { expect, type Page } from '@playwright/test';

export class ImmunizationsPage {
  constructor(readonly page: Page) {}

  readonly immunizationsTable = () => this.page.getByRole('table', { name: /immunizations summary/i });

  async navigateToImmunizationsPage() {
    await this.page.getByRole('link', { name: /immunizations/i }).click();
  }

  async addPatientImmunization() {
    await this.page.getByRole('button', { name: /record immunizations/i }).click();
    await this.page.getByRole('spinbutton', { name: /month, vaccination date/i }).clear();
    await this.page.getByRole('spinbutton', { name: /month, vaccination date/i }).fill('11');
    await this.page.getByRole('spinbutton', { name: /day, vaccination date/i }).clear();
    await this.page.getByRole('spinbutton', { name: /day, vaccination date/i }).fill('28');
    await this.page.getByRole('spinbutton', { name: /year, vaccination date/i }).clear();
    await this.page.getByRole('spinbutton', { name: /year, vaccination date/i }).fill('2024');
    await this.page.getByRole('combobox', { name: /immunization/i }).click();
    await this.page.getByText(/hepatitis b vaccination/i).click();
    await this.page.getByRole('button', { name: /save/i }).click();
    await expect(this.page.getByText(/vaccination saved successfully/i)).toBeVisible();
  }
}
