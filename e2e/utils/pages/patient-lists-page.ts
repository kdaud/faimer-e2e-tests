import { expect, type Page } from '@playwright/test';

export const patientListName = `Cohort ${Math.floor(Math.random() * 10000)}`;
export const patientListDescription = `Cohort Description ${Math.floor(Math.random() * 10000)}`;
export const editedPatientListName = `Cohort ${Math.floor(Math.random() * 10000)}`;
export const editedPatientListDescription = `Cohort Description ${Math.floor(Math.random() * 10000)}`;

export class PatientListsPage {
  constructor(readonly page: Page) {}

  readonly allListsButton = () => this.page.getByRole('tab', { name: /all lists/i });
  readonly myListsButton = () => this.page.getByRole('tab', { name: /my lists/i });
  readonly patientListsButton = () => this.page.getByRole('link', { name: /patient lists/i });
  readonly patientListsTable = () => this.page.getByTestId('patientListsTable');
  readonly patientListHeader = () => this.page.getByTestId('patientListHeader');
  readonly patientsTable = () => this.page.getByTestId('patientsTable');

  async navigateToPatientList() {
    await this.patientListsButton().click();
  }

  async navigateToMyList() {
    await this.myListsButton().click();
  }

  async addNewPatientList(listName: string, description: string) {
    await this.page.getByRole('button', { name: /new list/i }).click();
    await this.page.getByLabel(/list name/i).fill(listName);
    await this.page.getByLabel(/describe the purpose of this list in a few words/i).fill(description);
    await this.page.getByRole('button', { name: /create list/i }).click();
  }

  async editPatientList(listName: string, description: string) {
    await this.page.getByRole('button', { name: /actions/i }).click();
    await this.page.getByRole('menuitem', { name: /edit name or description/i }).click();
    await this.page.getByLabel(/list name/i).fill(listName);
    await this.page.getByLabel(/describe the purpose of this list in a few words/i).fill(description);
    await this.page.getByRole('button', { name: /edit list/i }).click();
  }

  async searchPatientList(listName: string) {
    await this.page.getByRole('searchbox').fill(listName);
  }

  async addPatientToList() {
    await this.page.getByRole('button', { name: /actions/i }).click();
    await expect(this.page.getByRole('menuitem', { name: /add to list/i })).toBeVisible();
    await this.page.getByRole('menuitem', { name: /add to list/i }).click();
    await this.page.locator('label').filter({ hasText: 'Cohort' }).click();
    await this.page.getByRole('button', { name: /add to list/i }).click();
  }
  
  async removePatientToList() {
    await this.page.getByRole('button', { name: /remove from list/i }).click();
    await this.page.getByRole('button', { name: /danger remove from list/i }).click();
    await expect(this.page.getByText(/patient removed from list/i)).toBeVisible();
  }

  async deletePatientList() {
    await this.page.getByRole('button', { name: /actions/i }).click();
    await this.page.getByRole('menuitem', { name: /delete patient list/i }).click();
    await this.page.getByRole('button', { name: /danger delete/i }).click();
    await expect(this.page.getByText(`Deleted patient list: ${patientListName}`)).toBeVisible();
    await expect(this.page.getByText(/deleted patient list/i)).toBeVisible();
  }
}
