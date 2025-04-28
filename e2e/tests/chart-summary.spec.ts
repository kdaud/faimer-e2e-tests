import { test, expect } from '@playwright/test';
import { delay, HomePage} from '../utils/pages/home-page';
import { Keycloak } from '../utils/pages/keycloak';

let homePage: HomePage;
let keycloak: Keycloak;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  keycloak = new Keycloak(page);

  await keycloak.open();
  await keycloak.navigateToUsers();
  await keycloak.addUserButton().click();
  await keycloak.createUser();
});

test('Patient summary to load all the apps', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Daniel Acosta'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();

  // replay
  await homePage.clickOnPatientResult('Daniel Acosta');

  // verify
  await expect(page.getByRole('button', { name: /visit note/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /clinical forms/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /patient lists/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /order basket/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /patient summary/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /vitals & biometrics/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /medications/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /orders/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /results/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /visits/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /allergies/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /conditions/i })).toBeVisible();
  await page.getByRole('link', { name: /allergies/i }).click();
  await expect(page.getByText(/record allergy intolerances/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /immunizations/i })).toBeVisible();
  await page.getByRole('link', { name: /immunizations/i }).click();
  await expect(page.getByText(/Record immunizations/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /attachments/i })).toBeVisible();
  await page.getByRole('link', { name: /attachments/i }).click();
  await expect(page.getByText(/record attachments/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /programs/i })).toBeVisible();
  await page.getByRole('link', { name: /programs/i }).click();
  await expect(page.getByText(/record program enrollments/i)).toBeVisible();
});

test.afterEach(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const keycloak = new Keycloak(page);
  await keycloak.deleteUser();
  await context.close();
});
