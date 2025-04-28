import { expect, type Page } from '@playwright/test';
import { delay } from './home-page';

export class OrdersPage {
  constructor(readonly page: Page) {}

  readonly ordersTable = () => this.page.getByRole('table', { name: /orders/i });

  async navigateToOrdersPage() {
    await this.page.getByRole('link', { name: /orders/i }).click();
  }

  async navigateToLabOrderForm() {
    await expect(this.page.locator('div').filter({ hasText: /^Drug orders \(0\)AddViewLab orders \(0\)AddView$/ }).getByRole('button').nth(2)).toBeVisible();
    await this.page.locator('div').filter({ hasText: /^Drug orders \(0\)AddViewLab orders \(0\)AddView$/ }).getByRole('button').nth(2).click();
  }

  async navigateToDrugOrderForm() {
    await expect(this.page.locator('div').filter({ hasText: /^Drug orders \(0\)AddViewLab orders \(0\)AddView$/ }).getByRole('button').first()).toBeVisible();
    await this.page.locator('div').filter({ hasText: /^Drug orders \(0\)AddViewLab orders \(0\)AddView$/ }).getByRole('button').first().click();
  }

  async saveLabOrder() {
    await this.page.waitForSelector('button:has-text("save order")');
    await this.page.getByRole('button', { name: /save order/i }).click(), delay(3000);
    await this.page.waitForSelector('button:has-text("sign and close")');
    await this.page.getByRole('button', { name: /sign and close/i }).click();
    await expect(this.page.getByText(/error/i)).not.toBeVisible();
    await expect(this.page.getByText(/placed orders/i)).toBeVisible(), delay(5000);
  }

  async modifyLabOrder() {
    await this.page.getByRole('button', { name: /options/i }).nth(0).click();
    await this.page.getByRole('menuitem', { name: /modify order/i }).click();
    await expect(this.page.getByRole('cell', { name: /bacteriuria test, urine/i })).toBeVisible();
    await this.page.locator('#labReferenceNumberInput').fill('202');
    await this.page.getByLabel('Priority').selectOption('STAT');
    await this.page.getByLabel(/additional instructions/i).fill('Take urine sample'), delay(2000);
  }

  async cancelLabOrder() {
    await this.page.getByRole('button', { name: /options/i }).nth(0).click(), delay(2000);
    await this.page.getByRole('menuitem', { name: /cancel order/i }).click(), delay(3000);
    await this.page.getByRole('button', { name: /sign and close/i }).click();
    await expect(this.page.getByText(/discontinued Blood urea nitrogen/i)).toBeVisible();
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

  async saveDrugOrder() {
    await this.page.getByRole('button', { name: /save order/i }).click(), delay(3000);
    await this.page.getByRole('button', { name: /sign and close/i }).focus();
    await this.page.getByRole('button', { name: /sign and close/i }).click();
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
    await this.page.getByRole('button', { name: /sign and close/i }).dispatchEvent('click');
  }

  async discontinueDrugOrder() {
    await this.page.getByRole('button', { name: /options/i, exact: true }).nth(0).click(), delay(2000);
    await this.page.getByRole('menuitem', { name: /discontinue/i }).click(), delay(4000);
    await expect(this.page.getByText(/discontinue/i)).toBeVisible();
    await expect(this.page.getByText(/sign and close/i)).toBeVisible();
    await this.page.getByRole('button', { name: /sign and close/i }).focus();
    await this.page.getByRole('button', { name: /sign and close/i }).dispatchEvent('click');
  }
}
