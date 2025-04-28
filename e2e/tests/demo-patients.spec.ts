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

test('Demo patients should be present and accessible through patient search', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();

  // replay
  await homePage.loginWithUser();

  // verify
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Betty Williams'), delay(3000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.patientSearchBar().clear(), delay(1000);
  await homePage.patientSearchBar().fill('Susan Lopez'), delay(3000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.patientSearchBar().clear(), delay(1000);
  await homePage.patientSearchBar().fill('Susan Hall'), delay(3000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.patientSearchBar().clear(), delay(1000);
  await homePage.patientSearchBar().fill('Donna Roberts'), delay(3000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.patientSearchBar().clear(), delay(1000);
  await homePage.patientSearchBar().fill('Daniel Scott'), delay(3000);
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
