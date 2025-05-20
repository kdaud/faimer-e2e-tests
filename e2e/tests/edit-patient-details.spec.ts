import { expect } from '@playwright/test';
import { test } from '../utils/configs/globalSetup';
import { delay, HomePage} from '../utils/pages/home-page';
import { EditPage } from '../utils/pages/edit-page';
import { Keycloak } from '../utils/pages/keycloak';

let homePage: HomePage;
let keycloak: Keycloak;
let editPage: EditPage

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  keycloak = new Keycloak(page);
  editPage = new EditPage(page);

  await keycloak.open();
  await keycloak.navigateToUsers();
  await keycloak.addUserButton().click();
  await keycloak.createUser();
});

test('Edit patient details', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Daniel Acosta'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Daniel Acosta');
  const patientBanner = page.locator('header[aria-label="patient banner"]');
  await expect(patientBanner.getByText(`Daniel Acosta`)).toBeVisible();
  await expect(patientBanner.getByText(/01-Jan-1953/i)).toBeVisible();

  // replay
  await editPage.updatePatientDetails();

  // verify
  await homePage.navigateToHomePage();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Daniel Acosta'), delay(2000);
  await expect(page.getByText(/sorry, no patient charts were found/i)).toBeVisible();
  await homePage.patientSearchBar().clear(), delay(1000);
  await homePage.patientSearchBar().fill('Daan Acosta'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Daan Acosta');
  await expect(patientBanner.getByText('Daan Acosta')).toBeVisible();
  await expect(patientBanner.getByText(/01-Jan-1953/i)).not.toBeVisible();
  await expect(patientBanner.getByText(/01-Jan-1952/i)).toBeVisible();
});

test.afterEach(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const keycloak = new Keycloak(page);
  await keycloak.deleteUser();
  await context.close();
});
