import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login'
import { InventoryPage } from '../pages/inventory'
import { CartPage } from '../pages/cart'
import { CheckoutPage } from '../pages/checkout'

test('login snapshot', async ({ page }) => {
    const Login = new LoginPage(page)

    await Login.GoToLoginPage()
    expect(await page.screenshot()).toMatchSnapshot('login_page.png');
})

test.describe('tests with hooks', () => {
    test.beforeEach('login', async ({ page }) => {
        const Login = new LoginPage(page)

        await Login.GoToLoginPage()
        await Login.Login('standard_user', 'secret_sauce')
    })

    test.afterEach('logout', async ({ page }) => {
        await page.getByRole('button', { name: 'Open Menu' }).click();
        await page.locator('[data-test="logout-sidebar-link"]').click();
    })

    test('inventory page snapshot', async ({ page }) => {
        expect(await page.screenshot()).toMatchSnapshot('inventory_page.png');
    })

    test('backpack description snapshot', async ({ page }) => {
        await page.locator('[data-test="item-4-title-link"]').click();
        expect(await page.screenshot()).toMatchSnapshot('backpack_description_page.png');
    })

    test('inventory page with products added snapshot', async ({page})=>{
        const Inventory = new InventoryPage(page)
        await Inventory.AddItemToCart('sauce-labs-backpack')
        await Inventory.AddItemToCart('sauce-labs-bike-light')
        expect(await page.screenshot()).toMatchSnapshot('inventory_with_products_added_page.png');
    })

    test('empty checkout page snapshot', async ({ page }) => {
        const Inventory = new InventoryPage(page)
        await Inventory.GoToCart()
        expect(await page.screenshot()).toMatchSnapshot('empty_checkout_page.png');
    })

    test('checkout page with products snapshot', async ({ page }) => {
        const Inventory = new InventoryPage(page)
        await Inventory.AddItemToCart('sauce-labs-backpack')
        await Inventory.AddItemToCart('sauce-labs-bike-light')
        await Inventory.GoToCart()
        expect(await page.screenshot()).toMatchSnapshot('checkout_page_with_products.png');
    })

    test('checkout information page snapshot', async ({ page }) => {
        const Inventory = new InventoryPage(page)
        const Cart = new CartPage(page)
        await Inventory.GoToCart()
        await Cart.GoToCheckout()
        expect(await page.screenshot()).toMatchSnapshot('checkout_information_page.png');
    })

    test('checkout overview page snapshot', async ({page}) =>{
        const Inventory = new InventoryPage(page)
        const Cart = new CartPage(page)
        const Checkout = new CheckoutPage(page)
        var items = ['sauce-labs-backpack', 'sauce-labs-bike-light', 'sauce-labs-bolt-t-shirt', 'sauce-labs-fleece-jacket', 'sauce-labs-onesie', 'test.allthethings()-t-shirt-(red)']

        await Inventory.AddItemToCart('sauce-labs-backpack')
        await Inventory.AddItemToCart('sauce-labs-bike-light')
        await Inventory.GoToCart()
        await Cart.GoToCheckout()
        await Checkout.FillInformation('standard', 'user', 'myAwesomePostalCode9999')
        await Checkout.Continue()
        expect(await page.screenshot()).toMatchSnapshot('Checkout_overview_page.png');
    })
})