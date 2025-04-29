import { type Page } from '@playwright/test';
import { delay } from './home-page';

export class ChartPage {
  constructor(readonly page: Page) {}

  readonly orderBasketButton = () => this.page.getByLabel(/order basket/i);
  readonly medicationsTable = () => this.page.getByRole('table', { name: /medications/i });

  async navigateToOrderBasket() {
    await this.orderBasketButton().click(), delay(3000);
  }

  async navigateToMedicationsPage() {
    await this.page.getByRole('link', { name: /medications/i }).click();
  }
}
