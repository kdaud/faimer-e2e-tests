import { Page, expect } from '@playwright/test';
import { user, userThree, userTwo } from './keycloak';

export const delay = (mills) => {
  const endTime = Date.now() + mills;
  while (Date.now() < endTime) {
    // Do nothing, just wait
  }
};

export class HomePage {
  constructor(readonly page: Page) {}

  readonly patientSearchIcon = () => this.page.locator('[data-testid="searchPatientIcon"]');
  readonly patientSearchBar = () => this.page.locator('[data-testid="patientSearchBar"]');
  readonly patientAdvancedSearch = () => this.page.locator('button[type="submit"]:text("Search")');
  readonly floatingSearchResultsContainer = () => this.page.locator('[data-testid="floatingSearchResultsContainer"]');
  readonly editPatientButton = () => this.page.getByRole('menuitem', { name: /edit patient details/i });
  readonly wardsButton = () => this.page.getByRole('link', { name: /wards/i });

  async navigateToLoginPage() {
    await this.page.goto(`${process.env.O3_URL_DEV}`), delay(5000);
    await expect(this.page.locator('#username')).toBeVisible();
    await expect(this.page.locator('#password')).toBeVisible();
  }

  async loginWithUser() {
    await this.page.locator('#username').fill(`${user.userName}`);
    await this.enterLoginCredentials();
  }

  async loginWithUserTwo() {
    await this.page.locator('#username').fill(`${userTwo.userName}`);
    await this.enterLoginCredentials();
  }

  async loginWithUserThree() {
    await this.page.locator('#username').fill(`${userThree.userName}`);
    await this.enterLoginCredentials();
  }

  async enterLoginCredentials() {
    await this.page.locator('#password').fill(`${process.env.O3_PASSWORD}`);
    await this.page.getByRole('button', { name: /log in/i }).click();
    await this.page.locator('label').filter({ hasText: /inpatient ward/i }).locator('span').first().click();
    await this.page.getByRole('button', { name: /confirm/i }).click(), delay(4000);
    await expect(this.page).toHaveURL(/.*home/);
    await expect(this.page.getByText(/today's appointments/i)).not.toBeVisible();
  }

  async navigateToHomePage() {
    await this.page.goto(`${process.env.O3_URL_DEV}/openmrs/spa/home`);
    await expect(this.page).toHaveURL(/.*home/);
  }

  async navigateToWardsPage() {
    await this.wardsButton().click();
  }

  async clickOnPatientResult(name: string) {
    await this.floatingSearchResultsContainer().locator(`text=${name}`).click();
  }

  async searchPatientId() {
    await this.page.getByRole('button', { name: /actions/i, exact: true }).click();
    await expect(this.editPatientButton()).toBeVisible();
    await this.editPatientButton().click(), delay(6000);
  }

  async logout() {
    await this.page.getByRole('button', { name: /my account/i }).click();
    await this.page.getByRole('button', { name: /logout/i }).click(), delay(2000);
  }
}
