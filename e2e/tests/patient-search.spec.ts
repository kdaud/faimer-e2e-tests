import { test, expect } from '@playwright/test';
import { delay, HomePage } from '../utils/pages/home-page';
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

test('Search patient by given name', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();

  // replay
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Acosta'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();

  // verify
  await homePage.clickOnPatientResult('Daniel Acosta');
  const patientBanner = page.locator('header[aria-label="patient banner"]');
  await expect(patientBanner.getByText(`Daniel Acosta`)).toBeVisible();
  await expect(patientBanner.getByText(/01-Jan-1953/i)).toBeVisible();
});

test('Search patient by full name', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();

  // replay
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Daichi Okada'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();

  // verify
  await homePage.clickOnPatientResult('Daichi Okada');
  const patientBanner = page.locator('header[aria-label="patient banner"]');
  await expect(patientBanner.getByText(`Daichi Okada`)).toBeVisible();
  await expect(patientBanner.getByText(/01-Jan-1969/i)).toBeVisible();
});

test('Search patient by identifier', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();

  // replay
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('100000Y'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();

  // verify
  await homePage.clickOnPatientResult('Betty Williams');
  const patientBanner = page.locator('header[aria-label="patient banner"]');
  await expect(patientBanner.getByText(`Betty Williams`)).toBeVisible();
  await expect(patientBanner.getByText(/15-Mar-1973/i)).toBeVisible();
});

test('Search patient by postal code', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();

  // replay
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Susan'), delay(2000);
  await expect(page.getByText('4 search results')).toBeVisible();
  await homePage.patientAdvancedSearch().click(), delay(2000);

  // verify
  await homePage.patientAdvancedSearch().click(), delay(2000);
  await page.locator('#postcode').fill('59690');
  await page.getByRole('button', { name: /apply/i }).click(), delay(2000);

  // verify
  await expect(page.getByText(/1 search result/)).toBeVisible();
  await expect(page.getByText('Susan Harris')).toBeVisible();
  await page.getByRole('link', { name: 'Susan Harris' }).click();
  await expect(page.locator('header[aria-label="patient banner"]').getByText('Susan Harris')).toBeVisible();
});

test('Search patient by age', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();

  // replay
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Susan'), delay(2000);
  await expect(page.getByText('4 search results')).toBeVisible();
  await homePage.patientAdvancedSearch().click(), delay(2000);

  // verify
  await homePage.patientAdvancedSearch().click(), delay(2000);
  //
  await page.locator('#age').fill('69');
  await page.getByRole('button', { name: /apply/i }).click(), delay(2000);

  // verify
  await expect(page.getByText(/1 search result/)).toBeVisible();
  await expect(page.getByText('Susan Hall')).toBeVisible();
  await page.getByRole('link', { name: 'Susan Hall' }).click();
  await expect(page.locator('header[aria-label="patient banner"]').getByText('Susan Hall')).toBeVisible();
});

test('Search patient by date of birth', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();

  // replay
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Susan'), delay(2000);
  await expect(page.getByText('4 search results')).toBeVisible();
  await homePage.patientAdvancedSearch().click(), delay(2000);

  // verify
  await homePage.patientAdvancedSearch().click(), delay(2000);
  //
  await page.locator('#dateOfBirth').fill('06');
  await page.locator('#monthOfBirth').fill('05');
  await page.locator('#yearOfBirth').fill('1971');
  await page.getByRole('button', { name: /apply/i }).click(), delay(2000);

  // verify
  await expect(page.getByText(/1 search result/)).toBeVisible();
  await expect(page.getByText('Susan Lopez')).toBeVisible();
  await page.getByRole('link', { name: 'Susan Lopez' }).click();
  await expect(page.locator('header[aria-label="patient banner"]').getByText('Susan Lopez')).toBeVisible();
});

test.afterEach(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const keycloak = new Keycloak(page);
  await keycloak.deleteUser();
  await context.close();
});
