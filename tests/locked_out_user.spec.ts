import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login'

test('login', async ({ page }) => {
    const Login = new LoginPage(page)

    await Login.GoToLoginPage()
    await expect(page).toHaveTitle('Swag Labs')
    await Login.Login('locked_out_user', 'secret_sauce')
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Sorry, this user has been locked out.');
})