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

test('Sample patients should be created upon the first user login', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();

  // replay
  await homePage.loginWithUser();

  // verify
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
  await homePage.patientSearchBar().fill('Leon Wagner'), delay(3000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.patientSearchBar().clear(), delay(1000);
  await homePage.patientSearchBar().fill('Daichi Okada'), delay(3000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.patientSearchBar().clear(), delay(1000);
});

test.afterEach(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const keycloak = new Keycloak(page);
  await keycloak.deleteUser();
  await context.close();
});
