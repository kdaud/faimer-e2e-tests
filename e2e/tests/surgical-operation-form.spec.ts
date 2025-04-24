import { test, expect } from '@playwright/test';
import { delay, HomePage } from '../utils/pages/home-page';
import { VisitsPage } from '../utils/pages/visits-page';
import { RegistrationPage } from '../utils/pages/registration-page';
import { ClinicalFormsPage } from '../utils/pages/clinical-forms-page';

let homePage: HomePage;
let visitsPage: VisitsPage;
let registrationPage: RegistrationPage;
let formsPage: ClinicalFormsPage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  visitsPage = new VisitsPage(page);
  formsPage = new ClinicalFormsPage(page);
  registrationPage = new RegistrationPage(page);

  await homePage.login();
  await registrationPage.navigateToRegistrationForm();
  await registrationPage.createPatient();
  await visitsPage.startPatientVisit();
  await formsPage.navigateToClinicalForms();
});

test('Add surgical operation instructions', async ({ page }) => {
  // setup
  await formsPage.navigateToSurgicalOperationForm();

  // replay
  await formsPage.fillSurgicalOperationForm();
  await formsPage.saveForm();

  // verify
  await visitsPage.navigateToVisitsPage();
  await page.getByRole('tab', { name: /Encounters/, exact: true }).click();
  await expect(page.getByRole('cell', {name: /surgical operation/i})).toBeVisible();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.locator('//span[normalize-space()="Pre-Operative Diagnosis"]/following-sibling::span[1]')).toHaveText(/acute appendicitis/i);
  await expect(page.locator('//span[normalize-space()="Post-Operative Diagnosis"]/following-sibling::span[1]')).toHaveText(/acute suppurative Appendicitis/i);
  await expect(page.locator('//span[normalize-space()="Procedure"]/following-sibling::span[1]')).toHaveText(/Laparoscopic appendectomy/i);
  await expect(page.locator('//span[normalize-space()="Estimated Blood Loss"]/following-sibling::span[1]')).toHaveText(/2.0/i);
  await expect(page.locator('//span[normalize-space()="Assistants"]/following-sibling::span[1]')).toHaveText(/Nurse Alex Johnson/i);
  await expect(page.locator('//span[normalize-space()="Complications"]/following-sibling::span[1]')).toHaveText(/none/i);
  await expect(page.locator('//span[normalize-space()="Specimens"]/following-sibling::span[1]')).toHaveText(/appendix sent for histopathological examination/i);
  await expect(page.locator('//span[normalize-space()="Surgeon"]/following-sibling::span[1]')).toHaveText(/Dr. Jane Smith/);
  await expect(page.locator('//span[normalize-space()="Anesthesia Type"]/following-sibling::span[1]')).toHaveText(/general/i);
  await expect(page.locator('//span[normalize-space()="Post-Operative Instructions"]/following-sibling::span[1]')).toHaveText(/pain management with paracetamol and morphine as needed/i);
  });

  test('Estimated blood loss field should allow valid input', async ({ page }) => {
    // setup
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
    await page.getByRole('tab', { name: /Encounters/, exact: true }).click();
    await expect(page.getByRole('cell', {name: /surgical operation/i})).toBeVisible();
    await page.getByRole('button', { name: /expand current row/i }).click();
    await expect(page.locator('//div[span[1][normalize-space()="Estimated Blood Loss"]]/span[2]')).toHaveText('1.0');
    });

  test.afterEach(async ({ }) => {
    await homePage.voidPatient();
  });
