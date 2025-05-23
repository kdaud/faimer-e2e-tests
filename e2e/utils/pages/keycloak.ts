import { Page, expect } from '@playwright/test';
import { delay } from './home-page';
import { KEYCLOAK_URL } from '../configs/globalSetup';

export var user = {
  userName : '',
  firstName : '',
  lastName : '',
  email : '',
  password: '',
}

export var userTwo = {
  userName : '',
  firstName : '',
  lastName : '',
  email : '',
  password: '',
}

export var userThree = {
  userName : '',
  firstName : '',
  lastName : '',
  email : '',
  password: '',
}
export class Keycloak {
  constructor(readonly page: Page) {}

  readonly addUserButton = () => this.page.getByTestId('add-user');

  async open() {
    await this.page.goto(`${KEYCLOAK_URL}/realms/master/account`);
    await this.page.getByRole('button', { name: /Sign in/ }).click();
    await this.page.getByLabel(/username or email/i).fill(`${process.env.KEYCLOAK_USERNAME}`);
    await this.page.getByLabel(/password/i).fill(`${process.env.KEYCLOAK_PASSWORD}`);
    await this.page.getByRole('button', { name: /sign in/i }).click();
    await expect(this.page).toHaveURL(/.*account/), delay(6000);
  }
  
  async navigateToUsers() {
    await this.page.goto(`${KEYCLOAK_URL}/admin/master/console`);
    await this.page.getByTestId('realmSelectorToggle').click();
    await expect(this.page.getByRole('menuitem', { name: 'ozone' })).toBeVisible();
    await this.page.getByRole('menuitem', { name: 'ozone' }).click();
    await this.page.getByRole('link', { name: /users/i }).click();
  }

  async createUser() {
    user = {
      userName : `${Array.from({ length: 5 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`,
      firstName: `${Array.from({ length: 6 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`,
      lastName: `${Array.from({ length: 6 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`,
      email: `${Array.from({ length: 6 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}@gmail.com`,
      password: `${Array.from({ length: 5 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`
    }
    await this.page.locator('input[name="username"]').fill(`${user.userName}`);
    await this.page.getByTestId('email-input').fill(`${user.email}`);
    await this.page.locator('label').filter({ hasText: /yes/i }).locator('span').first().click(), delay(1000);
    await this.page.getByTestId('firstName-input').fill(`${user.firstName}`);
    await this.page.getByTestId('lastName-input').fill(`${user.lastName}`);
    await this.saveUser();
    await this.navigateToCredentials();
    await this.enterUserPassword();
    await this.confirmUserPassword();
    await this.navigateToRoles();
    await this.assignRoleToUser();
  }

  async createUserTwo() {
    userTwo = {
      userName : `${Array.from({ length: 5 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`,
      firstName: `${Array.from({ length: 6 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`,
      lastName: `${Array.from({ length: 6 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`,
      email: `${Array.from({ length: 6 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}@gmail.com`,
      password: `${Array.from({ length: 5 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`
    }
    await this.page.locator('input[name="username"]').fill(`${userTwo.userName}`);
    await this.page.getByTestId('email-input').fill(`${userTwo.email}`);
    await this.page.locator('label').filter({ hasText: /yes/i }).locator('span').first().click(), delay(1000);
    await this.page.getByTestId('firstName-input').fill(`${userTwo.firstName}`);
    await this.page.getByTestId('lastName-input').fill(`${userTwo.lastName}`);
    await this.saveUser();
    await this.navigateToCredentials();
    await this.enterPasswordForUserTwo();
    await this.confirmUserPassword();
    await this.navigateToRoles();
    await this.assignRoleToUser();
  }

  async createUserThree() {
    userThree = {
      userName : `${Array.from({ length: 5 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`,
      firstName: `${Array.from({ length: 6 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`,
      lastName: `${Array.from({ length: 6 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`,
      email: `${Array.from({ length: 6 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}@gmail.com`,
      password: `${Array.from({ length: 5 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`
    }
    await this.page.locator('input[name="username"]').fill(`${userThree.userName}`);
    await this.page.getByTestId('email-input').fill(`${userThree.email}`);
    await this.page.locator('label').filter({ hasText: /yes/i }).locator('span').first().click(), delay(1000);
    await this.page.getByTestId('firstName-input').fill(`${userThree.firstName}`);
    await this.page.getByTestId('lastName-input').fill(`${userThree.lastName}`);
    await this.saveUser();
    await this.navigateToCredentials();
    await this.enterPasswordForUserThree();
    await this.confirmUserPassword();
    await this.navigateToRoles();
    await this.assignRoleToUser();
  }

  async saveUser() {
    await this.page.getByTestId('create-user').click();
    await expect(this.page.getByRole('heading', { name: /the user has been created/i })).toBeVisible(), delay(2000);
  }

  async navigateToCredentials() {
    await this.page.getByTestId('credentials').click();
  }

  async enterUserPassword() {
    await this.page.getByTestId('no-credentials-empty-action').click();
    await this.page.getByTestId('passwordField').fill(`${user.password}`);
    await this.page.getByTestId('passwordConfirmationField').fill(`${userTwo.password}`);
  }

  async enterPasswordForUserTwo() {
    await this.page.getByTestId('no-credentials-empty-action').click();
    await this.page.getByTestId('passwordField').fill(`${userTwo.password}`);
    await this.page.getByTestId('passwordConfirmationField').fill(`${userTwo.password}`);
  }

  async enterPasswordForUserThree() {
    await this.page.getByTestId('no-credentials-empty-action').click();
    await this.page.getByTestId('passwordField').fill(`${userThree.password}`);
    await this.page.getByTestId('passwordConfirmationField').fill(`${userThree.password}`);
  }

  async confirmUserPassword() {
    await this.page.locator('label').filter({ hasText: /onoff/i }).locator('span').first().click(), delay(1000);
    await this.page.getByTestId('confirm').click(), delay(1500);
    await this.page.getByTestId('confirm').click();
    await expect(this.page.getByRole('heading', { name: /the password has been set successfully/i })).toBeVisible(), delay(3000);
  }

  async navigateToRoles() {
    await this.page.getByTestId('role-mapping-tab').click();
    await this.page.getByTestId('assignRole').click();
    await this.page.getByRole('button', { name: /filter by realm roles/i }).click();
    await this.page.getByTestId('roles').click(), delay(2000);
  }

  async assignRoleToUser() {
    await this.page.getByRole('textbox', { name: /search/i }).fill('FAIMER Learner');
    await this.page.getByRole('textbox', { name: /search/i }).press('Enter');
    await this.page.getByRole('checkbox', { name: /select row/i }).check();
    await this.page.getByTestId('assign').click();
    await expect(this.page.getByText(/user role mapping successfully updated/i)).toBeVisible();
  }

  async deleteUser() {
    await this.open();
    await this.page.goto(`${KEYCLOAK_URL}/admin/master/console/#/ozone/users`);
    await this.page.getByRole('textbox', { name: 'search' }).fill(`${user.userName}`);
    await this.page.getByRole('textbox', { name: 'search' }).press('Enter'), delay(1500);
    await this.confirmDelete();
  }

  async deleteUsers() {
    await this.open();
    await this.page.goto(`${KEYCLOAK_URL}/admin/master/console/#/ozone/users`);
    await this.page.getByRole('textbox', { name: 'search' }).fill(`${user.userName}`);
    await this.page.getByRole('textbox', { name: 'search' }).press('Enter'), delay(1500);
    await this.confirmDelete();
    await this.page.getByRole('textbox', { name: 'search' }).fill(`${userTwo.userName}`);
    await this.page.getByRole('textbox', { name: 'search' }).press('Enter'), delay(1500);
    await this.confirmDelete();
    await this.page.getByRole('textbox', { name: 'search' }).fill(`${userThree.userName}`);
    await this.page.getByRole('textbox', { name: 'search' }).press('Enter'), delay(1500);
    await this.confirmDelete();
  }

  async confirmDelete() {
    await this.page.getByRole('button', { name: /actions/i }).first().click();
    await this.page.getByRole('menuitem', { name: /delete/i }).click();
    await this.page.getByTestId('confirm').click();
    await expect(this.page.getByText(/the user has been deleted/i).first()).toBeVisible();
  }
}
