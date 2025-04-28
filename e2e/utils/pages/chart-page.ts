import { type Page } from '@playwright/test';

export class ChartPage {
  constructor(readonly page: Page) {}

  readonly orderBasketButton = () => this.page.getByLabel(/order basket/i);
  readonly medicationsTable = () => this.page.getByRole('table', { name: /medications/i });

  async navigateToOrderBasket() {
    await this.orderBasketButton().click();
  }

  async navigateToMedicationsPage() {
    await this.page.getByRole('link', { name: /medications/i }).click();
  }
}
