import { test, expect } from '@playwright/test';
import { delay, HomePage} from '../utils/pages/home-page';
import { Keycloak } from '../utils/pages/keycloak';
import { VisitsPage } from '../utils/pages/visits-page';
import { 
  ClinicalFormsPage,
  consultations,
  dischargeInstructions,
  dischargeMedications,
  dischargeTo,
  hospitalCourse,
  procedure,
  updatedConsultations,
  updatedDischargeInstructions,
  updatedDischargeMedications,
  updatedHospitalCourse
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

test('Add discharge summary', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Daniel Acosta'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Daniel Acosta');
  await visitsPage.startPatientVisit();

  // replay
  await formsPage.navigateToClinicalForms();
  await formsPage.navigateToDischargeSummaryForm();
  await formsPage.fillDischargeSummaryForm();
  await formsPage.saveForm();

  // verify
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.locator('//span[normalize-space()="Discharge Medication"]/following-sibling::span[1]')).toHaveText(`${dischargeMedications}`);
  await expect(page.locator('//span[normalize-space()="Procedure"]/following-sibling::span[1]')).toHaveText(`${procedure}`);
  await expect(page.locator('//span[normalize-space()="Hospital Course"]/following-sibling::span[1]')).toHaveText(`${hospitalCourse}`);
  await expect(page.locator('//span[normalize-space()="Discharge Instructions"]/following-sibling::span[1]')).toHaveText(`${dischargeInstructions}`);
  await expect(page.locator('//span[normalize-space()="Discharge To"]/following-sibling::span[1]')).toHaveText(`${dischargeTo}`);
  await expect(page.locator('//span[normalize-space()="Diagnosis"]/following-sibling::span[1]')).toHaveText(/acute cholecystitis/i);
  await expect(page.locator('//span[normalize-space()="Consultations"]/following-sibling::span[1]')).toHaveText(`${consultations}`);
  await expect(page.locator('//span[normalize-space()="Admission Date"]/following-sibling::span[1]')).toHaveText(/2025-04-23/i);
  await expect(page.locator('//span[normalize-space()="Discharge Date"]/following-sibling::span[1]')).toHaveText(/2025-04-24/i);
});

test('Edit discharge summary', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Devan Modi'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Devan Modi');
  await visitsPage.startPatientVisit();
  await formsPage.navigateToClinicalForms();
  await formsPage.navigateToDischargeSummaryForm();
  await formsPage.fillDischargeSummaryForm();
  await formsPage.saveForm();
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.locator('//span[normalize-space()="Discharge Medication"]/following-sibling::span[1]')).toHaveText(`${dischargeMedications}`);
  await expect(page.locator('//span[normalize-space()="Procedure"]/following-sibling::span[1]')).toHaveText(`${procedure}`);
  await expect(page.locator('//span[normalize-space()="Hospital Course"]/following-sibling::span[1]')).toHaveText(`${hospitalCourse}`);
  await expect(page.locator('//span[normalize-space()="Discharge Instructions"]/following-sibling::span[1]')).toHaveText(`${dischargeInstructions}`);
  await expect(page.locator('//span[normalize-space()="Discharge To"]/following-sibling::span[1]')).toHaveText(`${dischargeTo}`);
  await expect(page.locator('//span[normalize-space()="Diagnosis"]/following-sibling::span[1]')).toHaveText(/acute cholecystitis/i);
  await expect(page.locator('//span[normalize-space()="Consultations"]/following-sibling::span[1]')).toHaveText(`${consultations}`);
  await expect(page.locator('//span[normalize-space()="Admission Date"]/following-sibling::span[1]')).toHaveText(/2025-04-23/i);
  await expect(page.locator('//span[normalize-space()="Discharge Date"]/following-sibling::span[1]')).toHaveText(/2025-04-24/i);

  // replay
  await formsPage.updateDischargeSummary();
  await homePage.navigateToHomePage();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Devan Modi'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Devan Modi');

  // verify
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.locator('//span[normalize-space()="Discharge Medication"]/following-sibling::span[1]')).not.toHaveText(`${dischargeMedications}`);
  await expect(page.locator('//span[normalize-space()="Discharge Medication"]/following-sibling::span[1]')).toHaveText(`${updatedDischargeMedications}`);
  await expect(page.locator('//span[normalize-space()="Procedure"]/following-sibling::span[1]')).toHaveText(`${procedure}`);
  await expect(page.locator('//span[normalize-space()="Hospital Course"]/following-sibling::span[1]')).not.toHaveText(`${hospitalCourse}`);
  await expect(page.locator('//span[normalize-space()="Hospital Course"]/following-sibling::span[1]')).toHaveText(`${updatedHospitalCourse}`);
  await expect(page.locator('//span[normalize-space()="Discharge Instructions"]/following-sibling::span[1]')).not.toHaveText(`${dischargeInstructions}`);
  await expect(page.locator('//span[normalize-space()="Discharge Instructions"]/following-sibling::span[1]')).toHaveText(`${updatedDischargeInstructions}`);
  await expect(page.locator('//span[normalize-space()="Discharge To"]/following-sibling::span[1]')).toHaveText(`${dischargeTo}`);
  await expect(page.locator('//span[normalize-space()="Diagnosis"]/following-sibling::span[1]')).not.toHaveText(/acute cholecystitis/i);
  await expect(page.locator('//span[normalize-space()="Diagnosis"]/following-sibling::span[1]')).toHaveText(/acute peptic ulcer with perforation/i);
  await expect(page.locator('//span[normalize-space()="Consultations"]/following-sibling::span[1]')).not.toHaveText(`${consultations}`);
  await expect(page.locator('//span[normalize-space()="Consultations"]/following-sibling::span[1]')).toHaveText(`${updatedConsultations}`);
  await expect(page.locator('//span[normalize-space()="Admission Date"]/following-sibling::span[1]')).not.toHaveText(/2025-04-23/i);
  await expect(page.locator('//span[normalize-space()="Admission Date"]/following-sibling::span[1]')).toHaveText(/2025-03-22/i);
  await expect(page.locator('//span[normalize-space()="Discharge Date"]/following-sibling::span[1]')).not.toHaveText(/2025-04-24/i);
  await expect(page.locator('//span[normalize-space()="Discharge Date"]/following-sibling::span[1]')).toHaveText(/2025-04-21/i);
});

test('Delete discharge summary', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Leon Wagner'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Leon Wagner');
  await visitsPage.startPatientVisit();
  await formsPage.navigateToClinicalForms();
  await formsPage.navigateToDischargeSummaryForm();
  await formsPage.fillDischargeSummaryForm();
  await formsPage.saveForm();
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.locator('//span[normalize-space()="Discharge Medication"]/following-sibling::span[1]')).toHaveText(`${dischargeMedications}`);
  await expect(page.locator('//span[normalize-space()="Procedure"]/following-sibling::span[1]')).toHaveText(`${procedure}`);
  await expect(page.locator('//span[normalize-space()="Hospital Course"]/following-sibling::span[1]')).toHaveText(`${hospitalCourse}`);
  await expect(page.locator('//span[normalize-space()="Discharge Instructions"]/following-sibling::span[1]')).toHaveText(`${dischargeInstructions}`);
  await expect(page.locator('//span[normalize-space()="Discharge To"]/following-sibling::span[1]')).toHaveText(`${dischargeTo}`);
  await expect(page.locator('//span[normalize-space()="Diagnosis"]/following-sibling::span[1]')).toHaveText(/acute cholecystitis/i);
  await expect(page.locator('//span[normalize-space()="Consultations"]/following-sibling::span[1]')).toHaveText(`${consultations}`);

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

test.afterEach(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const keycloak = new Keycloak(page);
  await keycloak.deleteUser();
  await context.close();
});
