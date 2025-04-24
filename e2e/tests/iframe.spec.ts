import { test, expect } from '@playwright/test';
import { HomePage } from '../utils/pages/home-page';

let homePage: HomePage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
});

test('Iframe page', async ({page}) => {
  // setup
  await homePage.login();
  await expect(page.locator("//a[text()='Wards']")).toBeVisible();
  await expect(page.locator("//a[text()='Patient lists']")).toBeVisible();
  await expect(page.locator("//a[text()='Laboratory']")).toBeVisible();
  await expect(page.locator("//a[text()='Service queues']")).toBeVisible();
  await expect(page.getByText(/active visits/i).nth(0)).toBeVisible();
  await expect(page.getByRole('button', {name: 'my account'})).toBeVisible();
  await expect(page.getByRole('button', {name: 'app menu'})).toBeVisible();
  await expect(page.getByRole('button', {name: 'add patient'})).toBeVisible();
  await expect(page.getByRole('button', {name: 'search patient'})).toBeVisible();

  // replay
  await page.goto(`${process.env.IFRAME_URL_DEV}`);

  // verify
  const iframe = await page.frameLocator('//iframe');
  await expect(iframe.locator("//a[text()='Wards']")).toBeVisible();
  await expect(iframe.locator("//a[text()='Patient lists']")).toBeVisible();
  await expect(iframe.locator("//a[text()='Laboratory']")).toBeVisible();
  await expect(iframe.locator("//a[text()='Service queues']")).toBeVisible();
  await expect(iframe.getByRole('button', {name: 'my account'})).toBeVisible();
  await expect(iframe.getByRole('button', {name: 'app menu'})).toBeVisible();
  await expect(iframe.getByRole('button', {name: 'add patient'})).toBeVisible();
  await expect(iframe.getByRole('button', {name: 'search patient'})).toBeVisible();
});
