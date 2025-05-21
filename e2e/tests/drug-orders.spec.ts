import { expect } from '@playwright/test';
import { test } from '../utils/configs/globalSetup';
import { delay, HomePage} from '../utils/pages/home-page';
import { Keycloak } from '../utils/pages/keycloak';
import { VisitsPage } from '../utils/pages/visits-page';
import { ChartPage } from '../utils/pages/chart-page';
import { OrdersPage } from '../utils/pages/orders-page';

let homePage: HomePage;
let keycloak: Keycloak;
let visitsPage: VisitsPage;
let chartPage: ChartPage;
let ordersPage: OrdersPage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  keycloak = new Keycloak(page);
  visitsPage = new VisitsPage(page);
  chartPage = new ChartPage(page);
  ordersPage = new OrdersPage(page);

  await keycloak.open();
  await keycloak.navigateToUsers();
  await keycloak.addUserButton().click();
  await keycloak.createUser();
});

test('Add a drug order', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Daniel Acosta'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Daniel Acosta');
  await visitsPage.startPatientVisit();

  // replay
  await chartPage.navigateToOrderBasket();
  await ordersPage.navigateToDrugOrderForm();
  await page.getByRole('searchbox').fill('Aspirin 325mg');
  await page.getByRole('button', { name: /order form/i }).click();
  await ordersPage.fillDrugOrderForm();
  await ordersPage.saveOrder();

  // verify
  await chartPage.navigateToMedicationsPage();
  await expect(page.getByText(/aspirin 325mg/i).nth(0)).toBeVisible();
  await expect(page.getByText(/12 tablet/i).nth(0)).toBeVisible();
  await expect(page.getByText(/twice daily/i).nth(0)).toBeVisible();
  await expect(page.getByText(/5 days/i).nth(0)).toBeVisible();
  await expect(page.getByText(/intravenous/i).nth(0)).toBeVisible();
  await expect(page.getByText(/indication hypertension/i).nth(0)).toBeVisible();
});

test('Modify a drug order', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Leon Wagner'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Leon Wagner');
  await visitsPage.startPatientVisit();
  await chartPage.navigateToOrderBasket();
  await ordersPage.navigateToDrugOrderForm();
  await page.getByRole('searchbox').fill('Aspirin 325mg');
  await page.getByRole('button', { name: /order form/i }).click();
  await ordersPage.fillDrugOrderForm();
  await ordersPage.saveOrder();
  await chartPage.navigateToMedicationsPage();
  await expect(page.getByText(/aspirin 325mg/i).nth(0)).toBeVisible();
  await expect(page.getByText(/12 tablet/i).nth(0)).toBeVisible();
  await expect(page.getByText(/twice daily/i).nth(0)).toBeVisible();
  await expect(page.getByText(/5 days/i).nth(0)).toBeVisible();
  await expect(page.getByText(/intravenous/i).nth(0)).toBeVisible();
  await expect(page.getByText(/indication hypertension/i).nth(0)).toBeVisible();

  // replay
  await page.getByRole('button', { name: /options/i, exact: true }).nth(0).click();
  await page.getByRole('menuitem', { name: /modify/i, exact: true }).click(), delay(3000);
  await ordersPage.modifyDrugOrder();

  // verify
  await expect(page.getByText(/aspirin 325mg/i).nth(0)).toBeVisible();
  await expect(page.getByText(/8 tablet/i).nth(0)).toBeVisible();
  await expect(page.getByText(/thrice daily/i).nth(0)).toBeVisible();
  await expect(page.getByText(/6 days/i).nth(0)).toBeVisible();
});

test('Discontinue a drug order', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Devan Modi'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Devan Modi');
  await visitsPage.startPatientVisit();
  await chartPage.navigateToOrderBasket();
  await ordersPage.navigateToDrugOrderForm();
  await page.getByRole('searchbox').fill('Aspirin 325mg');
  await page.getByRole('button', { name: /order form/i }).click();
  await ordersPage.fillDrugOrderForm();
  await ordersPage.saveOrder();
  await chartPage.navigateToMedicationsPage();
  await expect(page.getByText(/aspirin 325mg/i).nth(0)).toBeVisible();
  await expect(page.getByText(/12 tablet/i).nth(0)).toBeVisible();
  await expect(page.getByText(/twice daily/i).nth(0)).toBeVisible();
  await expect(page.getByText(/5 days/i).nth(0)).toBeVisible();
  await expect(page.getByText(/intravenous/i).nth(0)).toBeVisible();
  await expect(page.getByText(/indication hypertension/i).nth(0)).toBeVisible();

  // replay
  await ordersPage.discontinueDrugOrder();

  // verify
  await expect(page.locator('p', { hasText: 'Aspirin 325mg' })).toContainText('Discontinued');
});

test('Add a drug order with free text dosage', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Florencia Klinger'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Florencia Klinger');
  await visitsPage.startPatientVisit();

  // replay
  await chartPage.navigateToOrderBasket();
  await ordersPage.navigateToDrugOrderForm();
  await page.getByRole('searchbox').fill('Aspirin 81mg');
  await page.getByRole('button', { name: /order form/i }).click();
  await page.locator('div').filter({ hasText: /^Off$/ }).locator('div').click();
  await page.getByPlaceholder(/free text dosage/i).fill('2 Tablets - Every after eight hours - To be taken after a meal.');
  await page.getByLabel('Duration', { exact: true }).fill('3');
  await page.getByLabel(/quantity to dispense/i).fill('18');
  await page.getByLabel(/prescription refills/i).fill('2');
  await page.locator('#indication').fill('Hypertension');
  await ordersPage.saveOrder();

  // verify
  await chartPage.navigateToMedicationsPage();
  await expect(page.getByText(/aspirin 81mg/i).nth(0)).toBeVisible();
  await expect(page.getByText(/18 tablet/i).nth(0)).toBeVisible();
  await expect(page.getByText(/twice daily/i).nth(0)).toBeVisible();
  await expect(page.getByText(/3 days/i).nth(0)).toBeVisible();
  await expect(page.getByText(/2 tablets - every after eight hours - to be taken after a meal/i)).toBeVisible();
  await expect(page.getByText(/indication hypertension/i).nth(0)).toBeVisible();
});

test.afterEach(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const keycloak = new Keycloak(page);
  await keycloak.deleteUser();
  await context.close();
});
