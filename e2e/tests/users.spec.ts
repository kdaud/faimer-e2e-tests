import { test, expect } from '@playwright/test';
import { delay, HomePage } from '../utils/pages/home-page';
import { Keycloak } from '../utils/pages/keycloak';
import { VisitsPage } from '../utils/pages/visits-page';

let homePage: HomePage;
let keycloak: Keycloak;
let visitsPage: VisitsPage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  keycloak = new Keycloak(page);
  visitsPage = new VisitsPage(page);

  await keycloak.login();
});

test('User creation and data filtering', async ({ page }) => {
  // setup
  await keycloak.navigateToUsers();
  await keycloak.addUserButton().click();
  await keycloak.createFirstUser();
  await keycloak.navigateToCredentials();
  await keycloak.createUserPassword();
  await keycloak.navigateToRoles();
  await keycloak.assignRoleToUser();
  await page.getByLabel('Breadcrumb').getByRole('link', { name: /users/i }).click();
  await keycloak.addUserButton().click();
  await keycloak.createSecondUser();
  await keycloak.navigateToCredentials();
  await keycloak.createUserPassword();
  await keycloak.navigateToRoles();
  await keycloak.assignRoleToUser();

  // replay
  await homePage.navigateToLoginPage();
  await homePage.loginWithFirstUser();
  await homePage.searchExistingPatient('100005L');
  await page.getByRole('button', { name: /start a visit/i }).click();
  await page.locator('label').filter({ hasText: 'Facility Visit' }).locator('span').first().click();
  await page.locator('form').getByRole('button', { name: /start visit/i }).click();
  await expect(page.getByText(/facility visit started successfully/i)).toBeVisible(), delay(3000);
  await page.getByRole('button', { name: /close/i }).nth(1).click();
  await homePage.logout();

  // verify
  await homePage.loginWithSecondUser();
  await homePage.searchExistingPatient('100005L');
  await expect(page.getByText(/active visit/i)).not.toBeVisible();
  await page.getByRole('button', { name: /close/i }).nth(1).click();
  await homePage.logout();
});

test.afterEach(async ({}) => {
  await homePage.loginWithFirstUser();
  await homePage.searchExistingPatient('100005L');
  await visitsPage.endPatientVisit();
  await keycloak.deleteUser();
});
