import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login'
import { InventoryPage } from '../pages/inventory'
import { CartPage } from '../pages/cart'
import { CheckoutPage } from '../pages/checkout'
import { env } from './helpers/env'

test.describe('checkout tests', () => {
    test.beforeEach('login', async ({ page }) => {
        const Login = new LoginPage(page)
        const Inventory = new InventoryPage(page)
        const Cart = new CartPage(page)

        await page.goto('')
        await expect(page).toHaveTitle('Swag Labs')
        await Login.Login()
        await Inventory.AddItemToCart(env.products[0])
        await Inventory.AddItemToCart(env.products[2])
        await Inventory.AddItemToCart(env.products[4])
        await Inventory.GoToCart()
        await Cart.GoToCheckout()
    })

    test.afterEach('logout', async ({ page }) => {
        await page.getByRole('button', { name: 'Open Menu' }).click();
        await page.locator('[data-test="logout-sidebar-link"]').click();
        await page.close()
    })

    test('Checkout', async ({ page }) => {
        const Checkout = new CheckoutPage(page)

        await expect(page.locator('[data-test="title"]')).toHaveText("Checkout: Your Information")
        await Checkout.FillInformation(env.checkout_first_name, env.checkout_last_name, env.checkout_postal_CODE)
        await Checkout.Continue()
        await expect(page.locator('[data-test="title"]')).toHaveText("Checkout: Overview")
        await Checkout.Finish()
        await expect(page.locator('[data-test="complete-header"]')).toHaveText("Thank you for your order!")
        await Checkout.BackHome()
        await expect(page.locator('[data-test="title"]')).toHaveText("Products")
    })

    test('Missing information in checkout', async ({ page }) => {
        const Checkout = new CheckoutPage(page)

        await Checkout.Continue()
        const error_msg = await page.locator('[data-test="error"]').innerText()
        expect(error_msg).toMatch(/^Error:\s+.+\s+is required$/)
    })

    test("price calculation accuracy", async ({ page }) => {
        const Checkout = new CheckoutPage(page)
        await Checkout.FillInformation(env.checkout_first_name, env.checkout_last_name, env.checkout_postal_CODE)
        await Checkout.Continue()
        await page.pause()
        const subtotal_text = await page.locator('[data-test="subtotal-label"]').textContent()
        expect(subtotal_text).not.toBeNull()
        const subtotal_value = parseFloat(subtotal_text!.replace('Item total: $', '').trim())
        await Checkout.Cancel()
        let items_total_price: number = 0
        const removeButtons = page.locator('button:has-text("Remove")');
        const count = await removeButtons.count();
        expect(count, 'No Remove buttons found (cart may be empty)').toBeGreaterThan(0);
        for (let i = 0; i < count; i++) {
            const removeBtn = removeButtons.nth(i);

            const priceText = await removeBtn
                .locator('..')
                .locator('.inventory_item_price')
                .textContent();

            expect(priceText, `Missing price for item at index ${i}`).not.toBeNull()
            items_total_price += parseFloat(priceText!.replace('$', '').trim())
        }

        expect(subtotal_value, 'The calculated subtotal does not match the sum of the items prices').toBeCloseTo(items_total_price, 2)
    })
})