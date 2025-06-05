import { expect } from '@playwright/test';
import { test } from '../utils/configs/globalSetup';
import { delay, HomePage} from '../utils/pages/home-page';
import { Keycloak } from '../utils/pages/keycloak';
import { ChartPage } from '../utils/pages/chart-page';
import { ResultsPage } from '../utils/pages/results-page';

let keycloak: Keycloak;
let homePage: HomePage;
let chartPage: ChartPage;
let resultsPage: ResultsPage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  keycloak = new Keycloak(page);
  chartPage = new ChartPage(page);
  resultsPage = new ResultsPage(page);

  await keycloak.open();
  await keycloak.navigateToUsers();
  await keycloak.addUserButton().click();
  await keycloak.createUser();
});

test('Display test results in tablet mode', async ({ page, context }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();

  // replay
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Daichi Okada'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Daichi Okada');

  // verify
  await resultsPage.navigateToResultsPage();
  await resultsPage.navigateToOverTimeView();
  await expect(page.locator('div:has(span:has-text("X Ray chest (PA)")) >> xpath=following-sibling::div//p').nth(0)).toContainText('Left lower lobe infiltrate suspicious for pneumonia');
  await expect(page.locator('div:has-text("Haemoglobin")').locator('xpath=following-sibling::div[1]/p').nth(0)).toHaveText('13.2');
  await expect(page.locator('div:has-text("Platelets")').locator('xpath=following-sibling::div[1]/p').nth(0)).toHaveText('226.0');
  await expect(page.locator('div:has-text("White blood cells")').locator('xpath=following-sibling::div[1]/p').nth(0)).toHaveText('12.2');
  await resultsPage.navigateToIndividualTestsView();
  await expect(page.locator('text=X Ray chest (PA)').locator('xpath=ancestor::tr')).toContainText('Left lower lobe infiltrate suspicious for pneumonia');
  await expect(page.locator('text=Haemoglobin').locator('xpath=ancestor::tr').nth(0)).toContainText('13.2');
  await expect(page.locator('text=Platelets').locator('xpath=ancestor::tr').nth(0)).toContainText('226.0');
  await expect(page.locator('text=White blood cells').locator('xpath=ancestor::tr').nth(0)).toContainText('12.2');
  await chartPage.switchToTabletView();
  await context.setDefaultTimeout(5000);
  await resultsPage.navigateToOverTimeView();
  await expect(page.locator('div:has-text("X Ray chest (PA)")').locator('xpath=following-sibling::div[1]/p').nth(0)).toHaveText('Left lower lobe infiltrate suspicious for pneumonia');
  await expect(page.locator('div:has-text("Haemoglobin")').locator('xpath=following-sibling::div[1]/p').nth(0)).toHaveText('13.2');
  await expect(page.locator('div:has-text("Platelets")').locator('xpath=following-sibling::div[1]/p').nth(0)).toHaveText('226.0');
  await expect(page.locator('div:has-text("White blood cells")').locator('xpath=following-sibling::div[1]/p').nth(0)).toHaveText('12.2');
  await resultsPage.navigateToIndividualTestsView();
  await expect(page.locator('text=X Ray chest (PA)').locator('xpath=ancestor::tr')).toContainText('Left lower lobe infiltrate suspicious for pneumonia');
  await expect(page.locator('text=Haemoglobin').locator('xpath=ancestor::tr').nth(0)).toContainText('13.2');
  await expect(page.locator('text=Platelets').locator('xpath=ancestor::tr').nth(0)).toContainText('226.0');
  await expect(page.locator('text=White blood cells').locator('xpath=ancestor::tr').nth(0)).toContainText('12.2');
});

test.afterEach(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const keycloak = new Keycloak(page);
  await keycloak.deleteUser();
  await context.close();
});
