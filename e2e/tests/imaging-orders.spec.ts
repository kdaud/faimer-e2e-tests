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

test('Add an imaging order', async ({ page }) => {
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
  await ordersPage.navigateToImagingOrderForm();
  await page.getByRole('searchbox').fill('CT cervical spine'), delay(2500);
  await page.getByRole('button', { name: /order form/i }).click();
  await ordersPage.saveOrder();

  // verify
  await ordersPage.navigateToOrdersPage();
  await expect(page.locator("//tr[td[text()='Imaging orders']]").nth(0)).toBeVisible();
  await expect(page.locator("//tr[td[text()='Imaging orders'] and td[text()='CT cervical spine']]")).toBeVisible();
  await expect(page.locator("//tr[td[text()='Imaging orders'] and td[text()='CT cervical spine']]//div[@data-priority='routine']")).toBeVisible();
});

test('Modify an imaging order', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Devan Modi'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Devan Modi');
  await visitsPage.startPatientVisit();
  await chartPage.navigateToOrderBasket();
  await ordersPage.navigateToImagingOrderForm();
  await page.getByRole('searchbox').fill('X Ray soft tissue neck'), delay(2500);
  await page.getByRole('button', { name: /order form/i }).click();
  await ordersPage.saveOrder();
  await ordersPage.navigateToOrdersPage();
  await expect(page.locator("//tr[td[text()='Imaging orders']]").nth(0)).toBeVisible();
  await expect(page.locator("//tr[td[text()='Imaging orders'] and td[text()='X Ray soft tissue neck']]")).toBeVisible();
  await expect(page.locator("//tr[td[text()='Imaging orders'] and td[text()='X Ray soft tissue neck']]//div[@data-priority='routine']")).toBeVisible();

  // replay
  await ordersPage.modifyImagingOrder();
  await ordersPage.saveOrder();

  // verify
  await expect(page.locator("//tr[td[text()='Imaging orders']]").nth(0)).toBeVisible();
  await expect(page.locator("//tr[td[text()='Imaging orders'] and td[text()='X Ray soft tissue neck']]")).toBeVisible();
  await expect(page.locator("//tr[td[text()='Imaging orders'] and td[text()='X Ray soft tissue neck']]//div[@data-priority='routine']")).not.toBeVisible();
  await expect(page.locator("//tr[td[text()='Imaging orders'] and td[text()='X Ray soft tissue neck']]//div[@data-priority='stat']")).toBeVisible();
});

test('Discontinue an imaging order', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Florencia Klinger'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Florencia Klinger');
  await visitsPage.startPatientVisit();
  await chartPage.navigateToOrderBasket();
  await ordersPage.navigateToImagingOrderForm();
  await page.getByRole('searchbox').fill('MRI brain (with contrast)'), delay(2500);
  await page.getByRole('button', { name: /order form/i }).click();
  await ordersPage.saveOrder();
  await ordersPage.navigateToOrdersPage();
  await expect(page.locator("//tr[td[text()='Imaging orders']]").nth(0)).toBeVisible();
  await expect(page.locator("//tr[td[text()='Imaging orders'] and td[text()='MRI brain (with contrast)']]")).toBeVisible();
  await expect(page.locator("//tr[td[text()='Imaging orders'] and td[text()='MRI brain (with contrast)']]//div[@data-priority='routine']")).toBeVisible();

  // replay
  await ordersPage.cancelOrder();

  // verify
  await expect(page.locator("//tr[td[text()='Imaging orders'] and td[text()='MRI brain (with contrast)']]")).not.toBeVisible();
  await expect(page.locator("//tr[td[text()='Imaging orders'] and td[text()='MRI brain (with contrast)']]//div[@data-priority='routine']")).not.toBeVisible();
});

test.afterEach(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const keycloak = new Keycloak(page);
  await keycloak.deleteUser();
  await context.close();
});
