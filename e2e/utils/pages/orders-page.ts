import { expect, type Page } from '@playwright/test';

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
    await this.page.getByRole('button', { name: /save order/i }).click();
    await this.page.getByRole('button', { name: /sign and close/i }).click();
    await expect(this.page.getByText(/placed orders/i)).toBeVisible();
  }

  async modifyLabOrder() {
    await this.page.getByRole('button', { name: /options/i }).nth(0).click();
    await this.page.getByRole('menuitem', { name: /modify order/i }).click();
    await this.page.getByLabel('Priority').selectOption('STAT');
    await this.page.getByLabel(/additional instructions/i).fill('Take urine sample');
  }

  async cancelLabOrder() {
    await this.page.getByRole('button', { name: /options/i }).nth(0).click();
    await this.page.getByRole('menuitem', { name: /cancel order/i }).click();
    await expect(this.page.getByRole('button', { name: /sign and close/i })).toBeEnabled();
    await this.page.getByRole('button', { name: /sign and close/i }).click();
    await expect(this.page.getByText(/discontinued Blood urea nitrogen/i)).toBeVisible();
  }
}
