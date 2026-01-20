import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login'
import { InventoryPage } from '../pages/inventory'
import { CartPage } from '../pages/cart'
import { CheckoutPage } from '../pages/checkout'
import { env } from './helpers/env'

test.describe('inventory test', () => {
    test.beforeEach('login', async ({ page }) => {
        const Login = new LoginPage(page)
        await page.goto('/')
        await Login.Login()
    })

    test.afterEach('logout', async ({ page }) => {
        await page.getByRole('button', { name: 'Open Menu' }).click();
        await page.locator('[data-test="logout-sidebar-link"]').click();
        await page.close()
    })

    test('Adding and removing items', async ({ page }) => {
        const Inventory = new InventoryPage(page)

        await Inventory.AddItemToCart(env.products[0])
        await expect(page.locator('[data-test="remove-' + env.products[0] + '"]')).toBeVisible()
        await Inventory.RemoveItemFromCart(env.products[0])
        await expect(page.locator('[data-test="add-to-cart-' + env.products[0] + '"]')).toBeVisible()
    })
})

