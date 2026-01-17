import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login'
import { InventoryPage } from '../pages/inventory'
import { CartPage } from '../pages/cart'

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

test.only('Persistence of cart after reload', async ({ page }) => {
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

    const isEqual = itemsBeforeReload.length == itemsAfterReload.length && itemsBeforeReload.every(item=>itemsAfterReload.includes(item))
    expect(isEqual).toBe(true);
})