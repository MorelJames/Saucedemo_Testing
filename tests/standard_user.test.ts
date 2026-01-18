import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login'
import { InventoryPage } from '../pages/inventory'
import { CartPage } from '../pages/cart'
import { CheckoutPage } from '../pages/checkout'

test.describe('test with hooks', () => {

    test.beforeEach('login', async ({ page }) => {
        const Login = new LoginPage(page)

        await Login.GoToLoginPage()
        await expect(page).toHaveTitle('Swag Labs')
        await Login.Login('standard_user', 'secret_sauce')
        await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    })

    test.afterEach('logout', async ({ page }) => {
        await page.getByRole('button', { name: 'Open Menu' }).click();
        await page.locator('[data-test="logout-sidebar-link"]').click();
        expect(page.url()).toBe("https://www.saucedemo.com/");
    })

    test('Adding and removing items', async ({ page }) => {
        const Inventory = new InventoryPage(page)

        const items = ['sauce-labs-backpack', 'sauce-labs-bike-light', 'sauce-labs-bolt-t-shirt', 'sauce-labs-fleece-jacket', 'sauce-labs-onesie', 'test.allthethings()-t-shirt-(red)']
        await Inventory.AddItemToCart(items[0])
        await expect(page.locator('[data-test="remove-' + items[0] + '"]')).toBeVisible()
        await Inventory.RemoveItemFromCart(items[0])
        await expect(page.locator('[data-test="add-to-cart-' + items[0] + '"]')).toBeVisible()
    })

    test('Persistence of cart after reload', async ({ page }) => {
        const Inventory = new InventoryPage(page)
        const Cart = new CartPage(page)
        var items = ['sauce-labs-backpack', 'sauce-labs-bike-light', 'sauce-labs-bolt-t-shirt', 'sauce-labs-fleece-jacket', 'sauce-labs-onesie', 'test.allthethings()-t-shirt-(red)']

        await Inventory.AddItemToCart(items[0])
        await Inventory.AddItemToCart(items[2])
        await Inventory.AddItemToCart(items[4])
        await Inventory.GoToCart()

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
        var items = ['sauce-labs-backpack', 'sauce-labs-bike-light', 'sauce-labs-bolt-t-shirt', 'sauce-labs-fleece-jacket', 'sauce-labs-onesie', 'test.allthethings()-t-shirt-(red)']

        await Inventory.AddItemToCart(items[0])
        await Inventory.AddItemToCart(items[2])
        await Inventory.AddItemToCart(items[4])
        await Inventory.GoToCart()

        const itemsBeforeReload: string[] = await Cart.GetAllItemsInCart()
        await page.getByRole('button', { name: 'Open Menu' }).click();
        await page.locator('[data-test="logout-sidebar-link"]').click();
        await Login.Login('standard_user', 'secret_sauce')
        await Inventory.GoToCart()
        const itemsAfterLogout: string[] = await Cart.GetAllItemsInCart()

        const isEqual = itemsBeforeReload.length == itemsAfterLogout.length && itemsBeforeReload.every(item => itemsAfterLogout.includes(item))
        expect(isEqual).toBe(true);
    })

    test('Checkout', async ({ page }) => {
        const Inventory = new InventoryPage(page)
        const Cart = new CartPage(page)
        const Checkout = new CheckoutPage(page)
        var items = ['sauce-labs-backpack', 'sauce-labs-bike-light', 'sauce-labs-bolt-t-shirt', 'sauce-labs-fleece-jacket', 'sauce-labs-onesie', 'test.allthethings()-t-shirt-(red)']

        await Inventory.AddItemToCart(items[0])
        await Inventory.AddItemToCart(items[1])

        await Inventory.GoToCart()
        await expect(page.locator('[data-test="title"]')).toHaveText("Your Cart")
        await Cart.GoToCheckout()
        await expect(page.locator('[data-test="title"]')).toHaveText("Checkout: Your Information")
        await Checkout.FillInformation('standard', 'user', 'myAwesomePostalCode9999')
        await Checkout.Continue()
        await expect(page.locator('[data-test="title"]')).toHaveText("Checkout: Overview")
        await Checkout.Finish()
        await expect(page.locator('[data-test="complete-header"]')).toHaveText("Thank you for your order!")
        await Checkout.BackHome()
        await expect(page.locator('[data-test="title"]')).toHaveText("Products")
    })

    test('Missing information in checkout', async ({ page }) => {
        const Inventory = new InventoryPage(page)
        const Cart = new CartPage(page)
        const Checkout = new CheckoutPage(page)
        var items = ['sauce-labs-backpack', 'sauce-labs-bike-light', 'sauce-labs-bolt-t-shirt', 'sauce-labs-fleece-jacket', 'sauce-labs-onesie', 'test.allthethings()-t-shirt-(red)']

        await Inventory.AddItemToCart(items[0])
        await Inventory.AddItemToCart(items[1])
        await Inventory.GoToCart()
        await Cart.GoToCheckout()
        await Checkout.Continue()
        const error_msg = await page.locator('[data-test="error"]').innerText()
        expect(error_msg).toMatch(/^Error:\s+.+\s+is required$/)
    })
})

test('login with wrong information', async ({ page }) => {
    const Login = new LoginPage(page)

    await Login.GoToLoginPage()
    await Login.Login('standard_user', 'wrong_password')
    await expect(page.locator('[data-test="error"]')).toBeVisible();
})

