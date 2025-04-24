import { expect, type Page } from '@playwright/test';
import { delay } from './home-page';

export class OrdersPage {
  constructor(readonly page: Page) {}

  readonly ordersTable = () => this.page.getByRole('table', { name: /orders/i });

  async navigateToOrdersPage() {
    await this.page.getByRole('link', { name: /orders/i }).click();
  }

  async navigateToLabOrderForm() {
    await this.page.getByLabel('Order basket').click();
    await expect(this.page.getByText(/Lab orders/)).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Add', exact: true }).nth(1)).toBeVisible();
    await this.page.getByRole('button', { name: 'Add', exact: true }).nth(1).click();
  }

  async saveLabOrder() {
    await this.page.waitForSelector('button:has-text("save order")');
    await this.page.getByRole('button', { name: /save order/i }).click(), delay(3000);
    await this.page.waitForSelector('button:has-text("sign and close")');
    await this.page.getByRole('button', { name: /sign and close/i }).click();
    await expect(this.page.getByText(/placed orders/i)).toBeVisible(), delay(5000);
  }

  async modifyLabOrder() {
    await this.page.getByRole('button', { name: /options/i }).nth(0).click();
    await this.page.getByRole('menuitem', { name: /modify order/i }).click();
    await expect(this.page.getByRole('cell', { name: 'Blood urea nitrogen' })).toBeVisible();
    await this.page.locator('#labReferenceNumberInput').fill('202');
    await this.page.getByLabel('Priority').selectOption('STAT');
    await this.page.getByLabel(/additional instructions/i).fill('Take urine sample'), delay(3000);
  }

  async cancelLabOrder() {
    await this.page.getByRole('combobox', { name: /select order type:/i }).click();
    await this.page.getByRole('option', { name: /test order/i }).locator('div').click();
    await this.page.getByRole('button', { name: /options/i }).nth(0).click(), delay(4000);
    await this.page.getByRole('menuitem', { name: /cancel order/i }).click(), delay(20000);
    await expect(this.page.getByRole('cell', { name: 'Blood urea nitrogen' })).toBeVisible();
    await this.page.waitForSelector('text=Discontinue');
    await this.page.waitForSelector('button:has-text("sign and close")');
    await this.page.getByRole('button', { name: /sign and close/i }).click(), delay(3000);
    await expect(this.page.getByText(/discontinued Blood urea nitrogen/i)).toBeVisible();
  }
}
