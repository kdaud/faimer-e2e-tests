import { expect, type Page } from '@playwright/test';
import { delay } from './home-page';

export class ProgramsPage {
  constructor(readonly page: Page) {}

  readonly programsTable = () => this.page.getByRole('table', { name: /program enrollments/i });

  async navigateToProgramsPage() {
    await this.page.getByRole('link', { name: /programs/i }).click();
  }

  async addPatientProgramEnrollment() {
    await this.page.getByText(/record program enrollment/i).click();
    await this.page.locator('#program').selectOption('HIV Care and Treatment');
    await this.page.getByRole('spinbutton', { name: /month, date enrolled/i }).clear();
    await this.page.getByRole('spinbutton', { name: /month, date enrolled/i }).fill('08');
    await this.page.getByRole('spinbutton', { name: /day, date enrolled/i }).clear();
    await this.page.getByRole('spinbutton', { name: /day, date enrolled/i }).fill('15');
    await this.page.getByRole('spinbutton', { name: /year, date enrolled/i }).clear();
    await this.page.getByRole('spinbutton', { name: /year, date enrolled/i }).fill('2024');
    await this.page.getByRole('spinbutton', { name: /month, date completed/i }).clear();
    await this.page.getByRole('spinbutton', { name: /month, date completed/i }).fill('08');
    await this.page.getByRole('spinbutton', { name: /day, date completed/i }).clear();
    await this.page.getByRole('spinbutton', { name: /day, date completed/i }).fill('20');
    await this.page.getByRole('spinbutton', { name: /year, date completed/i }).clear();
    await this.page.getByRole('spinbutton', { name: /year, date completed/i }).fill('2024');
    await this.page.locator('#location').selectOption('Outpatient Clinic');
    await this.page.getByRole('button', { name: /save and close/i }).click(), delay(6000);
  }

  async updatePatientProgramEnrollment() {
    await this.page.getByRole('button', { name: /options/i }).click();
    await this.page.getByRole('menuitem', { name: /edit/i }).click();
    await this.page.getByRole('spinbutton', { name: /month, date enrolled/i }).clear();
    await this.page.getByRole('spinbutton', { name: /month, date enrolled/i }).fill('09');
    await this.page.getByRole('spinbutton', { name: /day, date enrolled/i }).clear();
    await this.page.getByRole('spinbutton', { name: /day, date enrolled/i }).fill('16');
    await this.page.getByRole('spinbutton', { name: /year, date enrolled/i }).clear();
    await this.page.getByRole('spinbutton', { name: /year, date enrolled/i }).fill('2024');
    await this.page.getByRole('spinbutton', { name: /month, date completed/i }).clear();
    await this.page.getByRole('spinbutton', { name: /month, date completed/i }).fill('09');
    await this.page.getByRole('spinbutton', { name: /day, date completed/i }).clear();
    await this.page.getByRole('spinbutton', { name: /day, date completed/i }).fill('21');
    await this.page.getByRole('spinbutton', { name: /year, date completed/i }).clear();
    await this.page.getByRole('spinbutton', { name: /year, date completed/i }).fill('2024');
    await this.page.locator('#location').selectOption('Inpatient Ward');
    await this.page.getByRole('button', { name: /save and close/i }).click();
    await expect(this.page.getByText(/program enrollment updated/i)).toBeVisible(), delay(6000);
  }
}
