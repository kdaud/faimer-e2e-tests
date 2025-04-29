import { expect, type Page } from '@playwright/test';
import { delay } from './home-page';

export class OrdersPage {
  constructor(readonly page: Page) {}

  readonly ordersTable = () => this.page.getByRole('table', { name: /orders/i });

  async navigateToOrdersPage() {
    await this.page.getByRole('link', { name: /orders/i }).click();
  }

  async navigateToDrugOrderForm() {
    await expect(this.page.locator('text=Drug orders').locator('xpath=../..').locator('button:has-text("Add")')).toBeVisible();
    await this.page.locator('text=Drug orders').locator('xpath=../..').locator('button:has-text("Add")').click();
  }
  async navigateToLabOrderForm() {
    await expect(this.page.locator('text=Lab orders').locator('xpath=../..').locator('button:has-text("Add")')).toBeVisible();
    await this.page.locator('text=Lab orders').locator('xpath=../..').locator('button:has-text("Add")').click();
  }

  async navigateToImagingOrderForm() {
    await expect(this.page.locator('text=Imaging orders').locator('xpath=../..').locator('button:has-text("Add")')).toBeVisible();
    await this.page.locator('text=Imaging orders').locator('xpath=../..').locator('button:has-text("Add")').click();
  }

  async modifyLabOrder() {
    await this.page.getByRole('button', { name: /options/i }).nth(0).click();
    await this.page.getByRole('menuitem', { name: /modify order/i }).click();
    await this.page.locator('#labReferenceNumberInput').fill('202');
    await this.page.getByLabel('Priority').selectOption('STAT');
    await this.page.getByLabel(/additional instructions/i).fill('Take urine sample'), delay(2000);
  }

  async modifyImagingOrder() {
    await this.page.getByRole('button', { name: /options/i }).nth(0).click();
    await this.page.getByRole('menuitem', { name: /modify order/i }).click();
    await this.page.getByLabel('Priority').selectOption('STAT');
    await this.page.getByLabel(/additional instructions/i).fill('Patient has stridor and difficulty swallowing. Please obtain AP and lateral views with the patient in an upright position if tolerated'), delay(2000);
  }

  async fillDrugOrderForm() {
    await this.page.getByPlaceholder('Dose').fill('4');
    await this.page.getByRole('button', { name: 'Open', exact: true }).nth(1).click();
    await this.page.getByText('Intravenous', {exact: true}).click();
    await this.page.getByRole('button', { name: 'Open', exact: true }).nth(2).click();
    await this.page.getByText('Twice daily', {exact: true}).click();
    await this.page.getByPlaceholder(/additional dosing instructions/i).fill('Take after eating');
    await this.page.getByLabel('Duration', { exact: true }).fill('5');
    await this.page.getByLabel(/quantity to dispense/i).fill('12');
    await this.page.getByLabel(/prescription refills/i).fill('3');
    await this.page.locator('#indication').fill('Hypertension');
  }

  async saveOrder() {
    await this.page.getByRole('button', { name: /save order/i }).click(), delay(3000);
    await this.page.getByRole('button', { name: /sign and close/i }).focus();
    await this.page.getByRole('button', { name: /sign and close/i }).click(), delay(1000);
    await expect(this.page.getByText(/error/i)).not.toBeVisible();
    await expect(this.page.getByText(/placed orders/i)).toBeVisible(), delay(5000);
  }

  async modifyDrugOrder() {
    await this.page.getByPlaceholder('Dose').fill('8');
    await this.page.getByLabel('Clear selected item').nth(2).click();
    await this.page.getByPlaceholder('Frequency').click();
    await this.page.getByText('Thrice daily').click();
    await this.page.getByLabel('Duration', { exact: true }).fill('6');
    await this.page.getByLabel(/quantity to dispense/i).fill('8'), delay(2000);
    await this.page.getByRole('button', { name: /save order/i }).focus();
    await this.page.getByRole('button', { name: /save order/i }).dispatchEvent('click');
    await expect(this.page.getByText(/sign and close/i)).toBeVisible();
    await this.page.getByRole('button', { name: /sign and close/i }).focus();
    await this.page.getByRole('button', { name: /sign and close/i }).dispatchEvent('click'), delay(1000);
    await expect(this.page.getByText(/error/i)).not.toBeVisible();
    await expect(this.page.getByText(/placed orders/i)).toBeVisible(), delay(5000);
  }

  async discontinueDrugOrder() {
    await this.page.getByRole('button', { name: /options/i, exact: true }).nth(0).click(), delay(2000);
    await this.page.getByRole('menuitem', { name: /discontinue/i }).click(), delay(4000);
    await expect(this.page.getByText(/discontinue/i)).toBeVisible();
    await expect(this.page.getByText(/sign and close/i)).toBeVisible();
    await this.page.getByRole('button', { name: /sign and close/i }).focus();
    await this.page.getByRole('button', { name: /sign and close/i }).dispatchEvent('click'), delay(1000);
    await expect(this.page.getByText(/error/i)).not.toBeVisible();
    await expect(this.page.getByText(/discontinued/)).toBeVisible();
  }

  async cancelOrder() {
    await this.page.getByRole('button', { name: /options/i }).nth(0).click(), delay(2000);
    await this.page.getByRole('menuitem', { name: /cancel order/i }).click(), delay(3000);
    await this.page.getByRole('button', { name: /sign and close/i }).click(), delay(1000);
    await expect(this.page.getByText(/error/i)).not.toBeVisible();
    await expect(this.page.getByText(/discontinued/i)).toBeVisible();
  }
}
