import { test, expect } from '@playwright/test';
import { delay, HomePage} from '../utils/pages/home-page';
import { Keycloak } from '../utils/pages/keycloak';
import { VisitsPage } from '../utils/pages/visits-page';
import { 
  ClinicalFormsPage,
  postOperativeDiagnosis,
  postOperativeInstructions,
  preOperativeDiagnosis,
  specimens,
  updatedPostOperativeInstructions,
  updatedSpecimens
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

test('Add surgical operation instructions', async ({ page }) => {
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
  await formsPage.navigateToSurgicalOperationForm();
  await formsPage.fillSurgicalOperationForm();
  await formsPage.saveForm();

  // verify
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.locator('//span[normalize-space()="Pre-Operative Diagnosis"]/following-sibling::span[1]')).toHaveText(`${preOperativeDiagnosis}`);
  await expect(page.locator('//span[normalize-space()="Post-Operative Diagnosis"]/following-sibling::span[1]')).toHaveText(`${postOperativeDiagnosis}`);
  await expect(page.locator('//span[normalize-space()="Procedure"]/following-sibling::span[1]')).toHaveText(/Laparoscopic appendectomy/i);
  await expect(page.locator('//span[normalize-space()="Estimated Blood Loss"]/following-sibling::span[1]')).toHaveText(/2.0/i);
  await expect(page.locator('//span[normalize-space()="Assistants"]/following-sibling::span[1]')).toHaveText(/Nurse Alex Johnson/i);
  await expect(page.locator('//span[normalize-space()="Complications"]/following-sibling::span[1]')).toHaveText(/none/i);
  await expect(page.locator('//span[normalize-space()="Specimens"]/following-sibling::span[1]')).toHaveText(`${specimens}`);
  await expect(page.locator('//span[normalize-space()="Surgeon"]/following-sibling::span[1]')).toHaveText(/Dr. Jane Smith/);
  await expect(page.locator('//span[normalize-space()="Time of Procedure"]/following-sibling::span[1]')).toHaveText(/2025-04-23/i);
  await expect(page.locator('//span[normalize-space()="Anesthesia Type"]/following-sibling::span[1]')).toHaveText(/general/i);
  await expect(page.locator('//span[normalize-space()="Post-Operative Instructions"]/following-sibling::span[1]')).toHaveText(`${postOperativeInstructions}`);
});

test('Edit surgical operation instructions', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Leon Wagner'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Leon Wagner');
  await visitsPage.startPatientVisit();
  await formsPage.navigateToClinicalForms();
  await formsPage.navigateToSurgicalOperationForm();
  await formsPage.fillSurgicalOperationForm();
  await formsPage.saveForm();
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.locator('//span[normalize-space()="Pre-Operative Diagnosis"]/following-sibling::span[1]')).toHaveText(`${preOperativeDiagnosis}`);
  await expect(page.locator('//span[normalize-space()="Post-Operative Diagnosis"]/following-sibling::span[1]')).toHaveText(`${postOperativeDiagnosis}`);
  await expect(page.locator('//span[normalize-space()="Procedure"]/following-sibling::span[1]')).toHaveText(/Laparoscopic appendectomy/i);
  await expect(page.locator('//span[normalize-space()="Estimated Blood Loss"]/following-sibling::span[1]')).toHaveText(/2.0/i);
  await expect(page.locator('//span[normalize-space()="Assistants"]/following-sibling::span[1]')).toHaveText(/Nurse Alex Johnson/i);
  await expect(page.locator('//span[normalize-space()="Complications"]/following-sibling::span[1]')).toHaveText(/none/i);
  await expect(page.locator('//span[normalize-space()="Specimens"]/following-sibling::span[1]')).toHaveText(`${specimens}`);
  await expect(page.locator('//span[normalize-space()="Surgeon"]/following-sibling::span[1]')).toHaveText(/Dr. Jane Smith/);
  await expect(page.locator('//span[normalize-space()="Time of Procedure"]/following-sibling::span[1]')).toHaveText(/2025-04-23/i);
  await expect(page.locator('//span[normalize-space()="Anesthesia Type"]/following-sibling::span[1]')).toHaveText(/general/i);
  await expect(page.locator('//span[normalize-space()="Post-Operative Instructions"]/following-sibling::span[1]')).toHaveText(`${postOperativeInstructions}`);

  // replay
  await formsPage.updateSurgicalOperation();
  await homePage.navigateToHomePage();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Leon Wagner'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Leon Wagner');

  // verify
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.locator('//span[normalize-space()="Pre-Operative Diagnosis"]/following-sibling::span[1]')).toHaveText(`${preOperativeDiagnosis}`);
  await expect(page.locator('//span[normalize-space()="Post-Operative Diagnosis"]/following-sibling::span[1]')).toHaveText(`${postOperativeDiagnosis}`);
  await expect(page.locator('//span[normalize-space()="Procedure"]/following-sibling::span[1]')).toHaveText(/Laparoscopic appendectomy/i);
  await expect(page.locator('//span[normalize-space()="Estimated Blood Loss"]/following-sibling::span[1]')).not.toHaveText(/2.0/i);
  await expect(page.locator('//span[normalize-space()="Estimated Blood Loss"]/following-sibling::span[1]')).toHaveText(/1.0/i);
  await expect(page.locator('//span[normalize-space()="Assistants"]/following-sibling::span[1]')).not.toHaveText(/Nurse Alex Johnson/i);
  await expect(page.locator('//span[normalize-space()="Assistants"]/following-sibling::span[1]')).toHaveText(/Nurse Alex JohnBosco/i);
  await expect(page.locator('//span[normalize-space()="Complications"]/following-sibling::span[1]')).toHaveText(/none/i);
  await expect(page.locator('//span[normalize-space()="Specimens"]/following-sibling::span[1]')).not.toHaveText(`${specimens}`);
  await expect(page.locator('//span[normalize-space()="Specimens"]/following-sibling::span[1]')).toHaveText(`${updatedSpecimens}`);
  await expect(page.locator('//span[normalize-space()="Surgeon"]/following-sibling::span[1]')).not.toHaveText(/Dr. Jane Smith/);
  await expect(page.locator('//span[normalize-space()="Surgeon"]/following-sibling::span[1]')).toHaveText(/Dr. John Smith/);
  await expect(page.locator('//span[normalize-space()="Time of Procedure"]/following-sibling::span[1]')).not.toHaveText(/2025-04-23/i);
  await expect(page.locator('//span[normalize-space()="Time of Procedure"]/following-sibling::span[1]')).toHaveText(/2025-04-24/i);
  await expect(page.locator('//span[normalize-space()="Anesthesia Type"]/following-sibling::span[1]')).not.toHaveText(/general/i);
  await expect(page.locator('//span[normalize-space()="Anesthesia Type"]/following-sibling::span[1]')).toHaveText(/monitored anesthesia care/i);
  await expect(page.locator('//span[normalize-space()="Post-Operative Instructions"]/following-sibling::span[1]')).not.toHaveText(`${postOperativeInstructions}`);
  await expect(page.locator('//span[normalize-space()="Post-Operative Instructions"]/following-sibling::span[1]')).toHaveText(`${updatedPostOperativeInstructions}`);
});

test('Delete surgical operation instructions', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Devan Modi'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Devan Modi');
  await visitsPage.startPatientVisit();
  await formsPage.navigateToClinicalForms();
  await formsPage.navigateToSurgicalOperationForm();
  await formsPage.fillSurgicalOperationForm();
  await formsPage.saveForm();
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.locator('//span[normalize-space()="Pre-Operative Diagnosis"]/following-sibling::span[1]')).toHaveText(`${preOperativeDiagnosis}`);
  await expect(page.locator('//span[normalize-space()="Post-Operative Diagnosis"]/following-sibling::span[1]')).toHaveText(`${postOperativeDiagnosis}`);
  await expect(page.locator('//span[normalize-space()="Procedure"]/following-sibling::span[1]')).toHaveText(/Laparoscopic appendectomy/i);
  await expect(page.locator('//span[normalize-space()="Estimated Blood Loss"]/following-sibling::span[1]')).toHaveText(/2.0/i);
  await expect(page.locator('//span[normalize-space()="Assistants"]/following-sibling::span[1]')).toHaveText(/Nurse Alex Johnson/i);
  await expect(page.locator('//span[normalize-space()="Complications"]/following-sibling::span[1]')).toHaveText(/none/i);
  await expect(page.locator('//span[normalize-space()="Specimens"]/following-sibling::span[1]')).toHaveText(`${specimens}`);
  await expect(page.locator('//span[normalize-space()="Surgeon"]/following-sibling::span[1]')).toHaveText(/Dr. Jane Smith/);
  await expect(page.locator('//span[normalize-space()="Time of Procedure"]/following-sibling::span[1]')).toHaveText(/2025-04-23/i);
  await expect(page.locator('//span[normalize-space()="Anesthesia Type"]/following-sibling::span[1]')).toHaveText(/general/i);
  await expect(page.locator('//span[normalize-space()="Post-Operative Instructions"]/following-sibling::span[1]')).toHaveText(`${postOperativeInstructions}`);

  // replay
  await formsPage.deleteEncounter();
  await homePage.navigateToHomePage();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Devan Modi'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Devan Modi');

  // verify
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await expect(page.getByText(/There are no encounters to display for this patient/).nth(0)).toBeVisible();
});

test('Estimated blood loss field should allow valid input', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Florencia Klinger'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Florencia Klinger');
  await visitsPage.startPatientVisit();
  await formsPage.navigateToClinicalForms();
  await formsPage.navigateToSurgicalOperationForm();

  // replay
  await page.getByRole('spinbutton', { name: /estimated blood loss/i }).fill('-1'), delay(2000);
  await expect(page.getByText(/value must be greater than 0/i)).toBeVisible();
  await page.getByRole('spinbutton', { name: /estimated blood loss/i }).clear();
  await page.getByRole('spinbutton', { name: /estimated blood loss/i }).fill('0'), delay(2000);
  await expect(page.getByText(/error/i)).not.toBeVisible();
  await page.getByRole('spinbutton', { name: /estimated blood loss/i }).clear();
  await page.getByRole('spinbutton', { name: /estimated blood loss/i }).fill('1'), delay(2000);
  await formsPage.saveForm();

  // verify
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await expect(page.getByRole('cell', {name: /surgical operation/i})).toBeVisible();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.locator('//div[span[1][normalize-space()="Estimated Blood Loss"]]/span[2]')).toHaveText('1.0');
  });

test.afterEach(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const keycloak = new Keycloak(page);
  await keycloak.deleteUser();
  await context.close();
});
