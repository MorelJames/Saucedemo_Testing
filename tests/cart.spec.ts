import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login'
import { InventoryPage } from '../pages/inventory'
import { CartPage } from '../pages/cart'
import { CheckoutPage } from '../pages/checkout'
import { env } from './helpers/env'

test.describe('cart test', () => {
    test.beforeEach('login', async ({ page }) => {
        const Login = new LoginPage(page)
        await page.goto('/')
        await Login.Login()
        const Inventory = new InventoryPage(page)

        await Inventory.AddItemToCart(env.products[0])
        await Inventory.AddItemToCart(env.products[2])
        await Inventory.AddItemToCart(env.products[4])
        await Inventory.GoToCart()

    })

    test.afterEach('logout', async ({ page }) => {
        await page.getByRole('button', { name: 'Open Menu' }).click();
        await page.locator('[data-test="logout-sidebar-link"]').click();
        await page.close()
    })

    test('Persistence of cart after reload', async ({ page }) => {
        const Cart = new CartPage(page)

        const itemsBeforeReload: string[] = await Cart.GetAllItemsInCart()
        await page.reload()
        const itemsAfterReload: string[] = await Cart.GetAllItemsInCart()

        const isEqual = itemsBeforeReload.length == itemsAfterReload.length && itemsBeforeReload.every(item => itemsAfterReload.includes(item))
        expect(isEqual).toBe(true);
    })

    test('Persistence of cart after logout', async ({ page }) => {
        const Login = new LoginPage(page)
        const Inventory = new InventoryPage(page)
        const Cart = new CartPage(page)

        const itemsBeforeReload: string[] = await Cart.GetAllItemsInCart()
        await page.getByRole('button', { name: 'Open Menu' }).click();
        await page.locator('[data-test="logout-sidebar-link"]').click();
        await Login.Login()
        await Inventory.GoToCart()
        const itemsAfterLogout: string[] = await Cart.GetAllItemsInCart()

        const isEqual = itemsBeforeReload.length == itemsAfterLogout.length && itemsBeforeReload.every(item => itemsAfterLogout.includes(item))
        expect(isEqual).toBe(true);
    })
})

