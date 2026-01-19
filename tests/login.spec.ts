import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login'
import { env } from './helpers/env'

test.describe('login tests', () => {

    test('login', async ({ page }) => {
        const Login = new LoginPage(page)
        await page.goto('/')
        await expect(page).toHaveTitle('Swag Labs')
        await Login.Login()
        await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    })

    test('logout', async ({ page }) => {
        const Login = new LoginPage(page)
        await page.goto('/')
        await Login.Login()
        await page.getByRole('button', { name: 'Open Menu' }).click();
        await page.locator('[data-test="logout-sidebar-link"]').click();
        expect(page.url()).toBe("https://www.saucedemo.com/");
    })

    test('login with wrong information', async ({ page }) => {
        await page.goto('/')
        await page.locator('[data-test="username"]').fill(env.wrong_user);
        await page.locator('[data-test="password"]').fill(env.wrong_password);
        await page.locator('[data-test="login-button"]').click();
        await expect(page.locator('[data-test="error"]')).toBeVisible();
    })

    test('login with locked out user', async ({ page }) => {
        await page.goto('/')
        await page.locator('[data-test="username"]').fill(env.locked_out_user);
        await page.locator('[data-test="password"]').fill(env.password);
        await page.locator('[data-test="login-button"]').click();
        await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    })
})

