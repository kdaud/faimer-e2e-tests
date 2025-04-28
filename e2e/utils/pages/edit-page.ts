import { type Page, expect } from '@playwright/test';
import { delay } from './home-page';

export var patientName = {
  updatedFirstName : ''
}

export class EditPage {
  constructor(readonly page: Page) {}

  readonly addPatientButton = () => this.page.getByRole('button', { name: /add patient/i });
  readonly createPatientButton = () => this.page.locator('button[type=submit]');
  readonly birthDateInput = () => this.page.locator('#birthdate');

  async navigateToRegistrationForm() {
    await this.addPatientButton().click();
    await expect(this.createPatientButton()).toBeEnabled();
  }

  async updatePatientDetails() {
    await this.page.getByRole('button', { name: /actions/i, exact: true }).click();
    await this.page.getByRole('menuitem', { name: /edit patient details/i }).click(), delay(4000);
    await this.page.locator('#givenName').fill('Daan'), delay(2000);
    await this.page.locator('#yearsEstimated').fill('73');
    await this.page.getByRole('button', { name: /update patient/i }).click();
    await expect(this.page.getByText(/patient details updated/i)).toBeVisible();
  }
}
