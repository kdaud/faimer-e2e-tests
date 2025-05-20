import { expect } from '@playwright/test';
import { test } from '../utils/configs/globalSetup';
import { delay, HomePage} from '../utils/pages/home-page';
import { Keycloak } from '../utils/pages/keycloak';
import { VisitsPage } from '../utils/pages/visits-page';
import { 
  ClinicalFormsPage,
  attendingPhysician,
  admittingDiagnosis,
  consults,
  updatedAdmittingDiagnosis,
  updatedConsults,
  updatedAttendingPhysician,
 } from '../utils/pages/clinical-forms-page';

let homePage: HomePage;
let keycloak: Keycloak;
let visitsPage: VisitsPage;
let formsPage: ClinicalFormsPage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  keycloak = new Keycloak(page);
  visitsPage = new VisitsPage(page);
  formsPage = new ClinicalFormsPage(page);

  await keycloak.open();
  await keycloak.navigateToUsers();
  await keycloak.addUserButton().click();
  await keycloak.createUser();
});

test('Add ward admission request', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Leon Wagner'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Leon Wagner');
  await visitsPage.startPatientVisit();

  // replay
  await formsPage.navigateToClinicalForms();
  await formsPage.navigateToWardAdmissionForm();
  await formsPage.fillWardAdmissionForm();
  await formsPage.saveForm();

  // verify
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage(), delay(2000);
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.locator('//span[normalize-space()="Attending physician"]/following-sibling::span[1]')).toHaveText(`${attendingPhysician}`);
  await expect(page.locator('//span[normalize-space()="Medications"]/following-sibling::span[1]')).toHaveText(/perform medication reconciliation/i);
  await expect(page.locator('//span[normalize-space()="Vitals"]/following-sibling::span[1]')).toHaveText(/per shift/i);
  await expect(page.locator('//span[normalize-space()="Activity"]/following-sibling::span[1]')).toHaveText(/strict bedrest/i);
  await expect(page.locator('//span[normalize-space()="Inpatient patient disposition"]/following-sibling::span[1]')).toHaveText(/admit to hospital/i);
  await expect(page.locator('//span[normalize-space()="Code status"]/following-sibling::span[1]')).toHaveText(/comfort measures/i);
  await expect(page.locator('//span[normalize-space()="Nursing orders"]/following-sibling::span[1]')).toHaveText(/elevate head of bed/i);
  await expect(page.locator('//span[normalize-space()="Diet"]/following-sibling::span[1]')).toHaveText(/regular diet/i);
  await expect(page.locator('//span[normalize-space()="Admitting diagnosis"]/following-sibling::span[1]')).toHaveText(`${admittingDiagnosis}`);
  await expect(page.locator('//span[normalize-space()="Bed assignment"]/following-sibling::span[1]')).toHaveText(/medical surgical/i);
  await expect(page.locator('//span[normalize-space()="Consults"]/following-sibling::span[1]')).toHaveText(`${consults}`);
});

test('Edit ward admission request', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Daichi Okada'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Daichi Okada');
  await visitsPage.startPatientVisit();
  await formsPage.navigateToClinicalForms();
  await formsPage.navigateToWardAdmissionForm();
  await formsPage.fillWardAdmissionForm();
  await formsPage.saveForm();
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage(), delay(2000);
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.locator('//span[normalize-space()="Attending physician"]/following-sibling::span[1]')).toHaveText(`${attendingPhysician}`);
  await expect(page.locator('//span[normalize-space()="Medications"]/following-sibling::span[1]')).toHaveText(/perform medication reconciliation/i);
  await expect(page.locator('//span[normalize-space()="Vitals"]/following-sibling::span[1]')).toHaveText(/per shift/i);
  await expect(page.locator('//span[normalize-space()="Activity"]/following-sibling::span[1]')).toHaveText(/strict bedrest/i);
  await expect(page.locator('//span[normalize-space()="Inpatient patient disposition"]/following-sibling::span[1]')).toHaveText(/admit to hospital/i);
  await expect(page.locator('//span[normalize-space()="Code status"]/following-sibling::span[1]')).toHaveText(/comfort measures/i);
  await expect(page.locator('//span[normalize-space()="Nursing orders"]/following-sibling::span[1]')).toHaveText(/elevate head of bed/i);
  await expect(page.locator('//span[normalize-space()="Diet"]/following-sibling::span[1]')).toHaveText(/regular diet/i);
  await expect(page.locator('//span[normalize-space()="Admitting diagnosis"]/following-sibling::span[1]')).toHaveText(`${admittingDiagnosis}`);
  await expect(page.locator('//span[normalize-space()="Bed assignment"]/following-sibling::span[1]')).toHaveText(/medical surgical/i);
  await expect(page.locator('//span[normalize-space()="Consults"]/following-sibling::span[1]')).toHaveText(`${consults}`);

  // replay
  await formsPage.updateWardRequest();
  await homePage.navigateToHomePage();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Daichi Okada'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Daichi Okada');

  // verify
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.locator('//span[normalize-space()="Attending physician"]/following-sibling::span[1]')).not.toHaveText(`${attendingPhysician}`);
  await expect(page.locator('//span[normalize-space()="Attending physician"]/following-sibling::span[1]')).toHaveText(`${updatedAttendingPhysician}`);
  await expect(page.locator('//span[normalize-space()="Code status"]/following-sibling::span[1]')).not.toHaveText(/comfort measures/i);
  await expect(page.locator('//span[normalize-space()="Code status"]/following-sibling::span[1]')).toHaveText(/full code/i);
  await expect(page.locator('//span[normalize-space()="Nursing orders"]/following-sibling::span[1]')).not.toHaveText(/elevate head of bed/i);
  await expect(page.locator('//span[normalize-space()="Nursing orders"]/following-sibling::span[1]')).toHaveText(/daily weights/i);
  await expect(page.locator('//span[normalize-space()="Admitting diagnosis"]/following-sibling::span[1]')).not.toHaveText(`${admittingDiagnosis}`);
  await expect(page.locator('//span[normalize-space()="Admitting diagnosis"]/following-sibling::span[1]')).toHaveText(`${updatedAdmittingDiagnosis}`);
  await expect(page.locator('//span[normalize-space()="Bed assignment"]/following-sibling::span[1]')).not.toHaveText(/medical surgical/i);
  await expect(page.locator('//span[normalize-space()="Bed assignment"]/following-sibling::span[1]')).toHaveText(/intensive care/i);
  await expect(page.locator('//span[normalize-space()="Consults"]/following-sibling::span[1]')).not.toHaveText(`${consults}`);
  await expect(page.locator('//span[normalize-space()="Consults"]/following-sibling::span[1]')).toHaveText(`${updatedConsults}`);
  await expect(page.locator('//span[normalize-space()="Inpatient patient disposition"]/following-sibling::span[1]')).toHaveText(/admit to hospital/i);
  await expect(page.locator('//span[normalize-space()="Vitals"]/following-sibling::span[1]')).toHaveText(/per shift/i);
  await expect(page.locator('//span[normalize-space()="Activity"]/following-sibling::span[1]')).toHaveText(/strict bedrest/i);
  await expect(page.locator('//span[normalize-space()="Diet"]/following-sibling::span[1]')).toHaveText(/regular diet/i);
});

test('Delete ward admission request', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Leon Wagner'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Leon Wagner');
  await visitsPage.startPatientVisit();
  await formsPage.navigateToClinicalForms();
  await formsPage.navigateToWardAdmissionForm();
  await formsPage.fillWardAdmissionForm();
  await formsPage.saveForm();
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage(), delay(2000);
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.locator('//span[normalize-space()="Attending physician"]/following-sibling::span[1]')).toHaveText(`${attendingPhysician}`);
  await expect(page.locator('//span[normalize-space()="Medications"]/following-sibling::span[1]')).toHaveText(/perform medication reconciliation/i);
  await expect(page.locator('//span[normalize-space()="Vitals"]/following-sibling::span[1]')).toHaveText(/per shift/i);
  await expect(page.locator('//span[normalize-space()="Activity"]/following-sibling::span[1]')).toHaveText(/strict bedrest/i);
  await expect(page.locator('//span[normalize-space()="Inpatient patient disposition"]/following-sibling::span[1]')).toHaveText(/admit to hospital/i);
  await expect(page.locator('//span[normalize-space()="Code status"]/following-sibling::span[1]')).toHaveText(/comfort measures/i);
  await expect(page.locator('//span[normalize-space()="Nursing orders"]/following-sibling::span[1]')).toHaveText(/elevate head of bed/i);
  await expect(page.locator('//span[normalize-space()="Diet"]/following-sibling::span[1]')).toHaveText(/regular diet/i);
  await expect(page.locator('//span[normalize-space()="Admitting diagnosis"]/following-sibling::span[1]')).toHaveText(`${admittingDiagnosis}`);
  await expect(page.locator('//span[normalize-space()="Bed assignment"]/following-sibling::span[1]')).toHaveText(/medical surgical/i);
  await expect(page.locator('//span[normalize-space()="Consults"]/following-sibling::span[1]')).toHaveText(`${consults}`);

  // replay
  await formsPage.deleteEncounter();
  await homePage.navigateToHomePage();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Leon Wagner'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Leon Wagner');

  // verify
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await expect(page.getByText(/There are no encounters to display for this patient/).nth(0)).toBeVisible();
});

test('Creating ward admission request should create admission request in the respective location', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Florencia Klinger'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Florencia Klinger');
  await visitsPage.startPatientVisit();

  // replay
  await formsPage.navigateToClinicalForms();
  await formsPage.navigateToWardAdmissionForm();
  await formsPage.fillWardAdmissionForm();
  await formsPage.saveForm();
  await homePage.navigateToHomePage();
  await homePage.navigateToWardsPage();

  // verify
  await page.getByRole('button', { name: /manage/i }).click();
  await expect(page.getByText(/admission requests/i)).toBeVisible();
  await expect(page.getByText('Florencia Klinger')).toBeVisible();
});

test.afterEach(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const keycloak = new Keycloak(page);
  await keycloak.deleteUser();
  await context.close();
});
