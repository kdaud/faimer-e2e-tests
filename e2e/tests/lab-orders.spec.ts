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

test('Add a lab test', async ({ page }) => {
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
  await ordersPage.navigateToLabOrderForm();
  await page.getByRole('searchbox').fill('Bacteriuria test, urine'), delay(2500);
  await page.getByRole('button', { name: /order form/i }).click();
  await ordersPage.saveOrder();

  // verify
  await ordersPage.navigateToOrdersPage();
  await expect(page.locator("//tr[td[text()='Test order']]").nth(0)).toBeVisible();
  await expect(page.locator("//tr[td[text()='Test order'] and td[text()='Bacteriuria test, urine']]")).toBeVisible();
  await expect(page.locator("//tr[td[text()='Test order'] and td[text()='Bacteriuria test, urine']]//div[@data-priority='routine']")).toBeVisible();
});

test('Modify a lab order', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Daichi Okada'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Daichi Okada');
  await visitsPage.startPatientVisit();
  await chartPage.navigateToOrderBasket();
  await ordersPage.navigateToLabOrderForm();
  await page.getByRole('searchbox').fill('Blood urea nitrogen'), delay(2500);
  await page.getByRole('button', { name: /order form/i }).click();
  await ordersPage.saveOrder();
  await ordersPage.navigateToOrdersPage();
  await expect(page.locator("//tr[td[text()='Test order']]").nth(0)).toBeVisible();
  await expect(page.locator("//tr[td[text()='Test order'] and td[text()='Blood urea nitrogen']]")).toBeVisible();
  await expect(page.locator("//tr[td[text()='Test order'] and td[text()='Blood urea nitrogen']]//div[@data-priority='routine']")).toBeVisible();

  // replay
  await ordersPage.modifyLabOrder();
  await ordersPage.saveOrder();

  // verify
  await expect(page.locator("//tr[td[text()='Test order']]").nth(0)).toBeVisible();
  await expect(page.locator("//tr[td[text()='Test order'] and td[text()='Blood urea nitrogen']]")).toBeVisible();
  await expect(page.locator("//tr[td[text()='Test order'] and td[text()='Blood urea nitrogen']]//div[@data-priority='routine']")).not.toBeVisible();
  await expect(page.locator("//tr[td[text()='Test order'] and td[text()='Blood urea nitrogen']]//div[@data-priority='stat']")).toBeVisible();
});

test('Discontinue a lab order', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Florencia Klinger'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Florencia Klinger');
  await visitsPage.startPatientVisit();
  await chartPage.navigateToOrderBasket();
  await ordersPage.navigateToLabOrderForm();
  await page.getByRole('searchbox').fill('Complete blood count'), delay(2500);
  await page.getByRole('button', { name: /order form/i }).click();
  await ordersPage.saveOrder();
  await ordersPage.navigateToOrdersPage();
  await expect(page.locator("//tr[td[text()='Test order']]").nth(0)).toBeVisible();
  await expect(page.locator("//tr[td[text()='Test order'] and td[text()='Complete blood count']]")).toBeVisible();
  await expect(page.locator("//tr[td[text()='Test order'] and td[text()='Complete blood count']]//div[@data-priority='routine']")).toBeVisible();

  // replay
  await ordersPage.cancelOrder();

  // verify
  await expect(page.locator("//tr[td[text()='Test order'] and td[text()='Complete blood count']]")).not.toBeVisible();
  await expect(page.locator("//tr[td[text()='Test order'] and td[text()='Complete blood count']]//div[@data-priority='routine']")).not.toBeVisible();
});

test.afterEach(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const keycloak = new Keycloak(page);
  await keycloak.deleteUser();
  await context.close();
});
