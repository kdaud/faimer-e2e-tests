import { expect } from '@playwright/test';
import { test } from '../utils/configs/globalSetup';
import { delay, HomePage} from '../utils/pages/home-page';
import { Keycloak } from '../utils/pages/keycloak';
import { VisitsPage } from '../utils/pages/visits-page';
import { 
  ClinicalFormsPage,
  assessment,
  objectiveFindings,
  plan,
  subjectiveFindings,
  updatedAssessment,
  updatedObjectiveFindings,
  updatedPlan,
  updatedSubjectiveFindings
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

test('Add soap note', async ({ page }) => {
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
  await formsPage.navigateToSOAPNoteForm();
  await formsPage.fillSOAPNoteForm();
  await formsPage.saveForm();

  // verify
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.locator('//span[normalize-space()="Subjective Findings"]/following-sibling::span[1]')).toHaveText(`${subjectiveFindings}`);
  await expect(page.locator('//span[normalize-space()="Objective Findings"]/following-sibling::span[1]')).toHaveText(`${objectiveFindings}`);
  await expect(page.locator('//span[normalize-space()="Assessment"]/following-sibling::span[1]')).toHaveText(`${assessment}`);
  await expect(page.locator('//span[normalize-space()="Plan"]/following-sibling::span[1]')).toHaveText(`${plan}`);
});

test('Edit soap note', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Devan Modi'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Devan Modi');
  await visitsPage.startPatientVisit();
  await formsPage.navigateToClinicalForms();
  await formsPage.navigateToSOAPNoteForm();
  await formsPage.fillSOAPNoteForm();
  await formsPage.saveForm();
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.locator('//span[normalize-space()="Subjective Findings"]/following-sibling::span[1]')).toHaveText(`${subjectiveFindings}`);
  await expect(page.locator('//span[normalize-space()="Objective Findings"]/following-sibling::span[1]')).toHaveText(`${objectiveFindings}`);
  await expect(page.locator('//span[normalize-space()="Assessment"]/following-sibling::span[1]')).toHaveText(`${assessment}`);
  await expect(page.locator('//span[normalize-space()="Plan"]/following-sibling::span[1]')).toHaveText(`${plan}`);

  // replay
  await formsPage.updateSOAPNoteForm();
  await homePage.navigateToHomePage();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Devan Modi'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Devan Modi');

  // verify
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.locator('//span[normalize-space()="Subjective Findings"]/following-sibling::span[1]')).not.toHaveText(`${subjectiveFindings}`);
  await expect(page.locator('//span[normalize-space()="Subjective Findings"]/following-sibling::span[1]')).toHaveText(`${updatedSubjectiveFindings}`);
  await expect(page.locator('//span[normalize-space()="Objective Findings"]/following-sibling::span[1]')).not.toHaveText(`${objectiveFindings}`);
  await expect(page.locator('//span[normalize-space()="Objective Findings"]/following-sibling::span[1]')).toHaveText(`${updatedObjectiveFindings}`);
  await expect(page.locator('//span[normalize-space()="Assessment"]/following-sibling::span[1]')).not.toHaveText(`${assessment}`);
  await expect(page.locator('//span[normalize-space()="Assessment"]/following-sibling::span[1]')).toHaveText(`${updatedAssessment}`);
  await expect(page.locator('//span[normalize-space()="Plan"]/following-sibling::span[1]')).not.toHaveText(`${plan}`);
  await expect(page.locator('//span[normalize-space()="Plan"]/following-sibling::span[1]')).toHaveText(`${updatedPlan}`);
});

test('Delete soap note', async ({ page }) => {
  // setup
  await homePage.navigateToLoginPage();
  await homePage.loginWithUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Leon Wagner'), delay(2000);
  await expect(page.getByText('1 search result')).toBeVisible();
  await homePage.clickOnPatientResult('Leon Wagner');
  await visitsPage.startPatientVisit();
  await formsPage.navigateToClinicalForms();
  await formsPage.navigateToSOAPNoteForm();
  await formsPage.fillSOAPNoteForm();
  await formsPage.saveForm();
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.locator('//span[normalize-space()="Subjective Findings"]/following-sibling::span[1]')).toHaveText(`${subjectiveFindings}`);
  await expect(page.locator('//span[normalize-space()="Objective Findings"]/following-sibling::span[1]')).toHaveText(`${objectiveFindings}`);
  await expect(page.locator('//span[normalize-space()="Assessment"]/following-sibling::span[1]')).toHaveText(`${assessment}`);
  await expect(page.locator('//span[normalize-space()="Plan"]/following-sibling::span[1]')).toHaveText(`${plan}`);

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
