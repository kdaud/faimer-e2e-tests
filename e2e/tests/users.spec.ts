import { test, expect } from '@playwright/test';
import { delay, HomePage } from '../utils/pages/home-page';
import { Keycloak } from '../utils/pages/keycloak';

let homePage: HomePage;
let keycloak: Keycloak;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  keycloak = new Keycloak(page);

  await keycloak.open();
});

test('User creation and data filtering', async ({ page }) => {
  // setup
  test.setTimeout(240000);
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
  await page.getByLabel('Breadcrumb').getByRole('link', { name: /users/i }).click();
  await keycloak.addUserButton().click();
  await keycloak.createThirdUser();
  await keycloak.navigateToCredentials();
  await keycloak.createUserPassword();
  await keycloak.navigateToRoles();
  await keycloak.assignRoleToUser();

  // replay
  await homePage.navigateToLoginPage();
  await homePage.loginWithFirstUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Daniel Acosta'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Daniel Acosta');
  await homePage.searchPatientId();
  const patientIdentifierForFirstSamplePatient = await page.locator('[data-testid="identifier-placeholder"]').textContent();
  await homePage.navigateToHomePage();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Devan Modi'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Devan Modi');
  await homePage.searchPatientId();
  const patientIdentifierForSecondSamplePatient = await page.locator('[data-testid="identifier-placeholder"]').textContent();
  await homePage.navigateToHomePage();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Florencia Klinger'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Florencia Klinger');
  await homePage.searchPatientId();
  const patientIdentifierForThirdSamplePatient = await page.locator('[data-testid="identifier-placeholder"]').textContent();
  await homePage.logout();

  // verify
  await homePage.loginWithSecondUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Daniel Acosta'), delay(3000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.patientSearchBar().clear(), delay(1000);
  await homePage.patientSearchBar().fill('Devan Modi'), delay(3000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.patientSearchBar().clear(), delay(1000);
  await homePage.patientSearchBar().fill('Florencia Klinger'), delay(3000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.patientSearchBar().clear(), delay(1000);
  await homePage.patientSearchBar().fill(`${patientIdentifierForFirstSamplePatient}`), delay(3000);
  await expect(page.getByText(/sorry, no patient charts were found/i)).toBeVisible();
  await homePage.patientSearchBar().clear(), delay(1000);
  await homePage.patientSearchBar().fill(`${patientIdentifierForSecondSamplePatient}`), delay(3000);
  await expect(page.getByText(/sorry, no patient charts were found/i)).toBeVisible();
  await homePage.patientSearchBar().clear(), delay(1000);
  await homePage.patientSearchBar().fill(`${patientIdentifierForThirdSamplePatient}`), delay(3000);
  await expect(page.getByText(/sorry, no patient charts were found/i)).toBeVisible();
  await homePage.patientSearchBar().clear(), delay(1000);
  await homePage.logout();
  await homePage.loginWithThirdUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Daniel Acosta'), delay(3000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.patientSearchBar().clear(), delay(1000);
  await homePage.patientSearchBar().fill('Devan Modi'), delay(3000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.patientSearchBar().clear(), delay(1000);
  await homePage.patientSearchBar().fill('Florencia Klinger'), delay(3000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.patientSearchBar().clear(), delay(1000);
  await homePage.patientSearchBar().fill(`${patientIdentifierForFirstSamplePatient}`), delay(3000);
  await expect(page.getByText(/sorry, no patient charts were found/i)).toBeVisible();
  await homePage.patientSearchBar().clear(), delay(1000);
  await homePage.patientSearchBar().fill(`${patientIdentifierForSecondSamplePatient}`), delay(3000);
  await expect(page.getByText(/sorry, no patient charts were found/i)).toBeVisible();
  await homePage.patientSearchBar().clear(), delay(1000);
  await homePage.patientSearchBar().fill(`${patientIdentifierForThirdSamplePatient}`), delay(3000);
  await expect(page.getByText(/sorry, no patient charts were found/i)).toBeVisible();
  await homePage.patientSearchBar().clear(), delay(1000);
  await homePage.logout();
});

test.afterEach(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const keycloak = new Keycloak(page);
  await keycloak.deleteUsers();
  await context.close();
});
