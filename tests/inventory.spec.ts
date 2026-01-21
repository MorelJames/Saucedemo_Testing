import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login'
import { InventoryPage } from '../pages/inventory'
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

    test('inventory items are sorted by name (A to Z)', async ({ page }) => {
        await page.selectOption('.product_sort_container', 'az');

        const itemNames = await page.locator('.inventory_item_name').allTextContents()
        expect(itemNames.length).toBeGreaterThan(1);
        const expectedSortedNames = [...itemNames].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        expect(itemNames).toEqual(expectedSortedNames);
    });

    test('inventory items are sorted by name (Z to A)', async ({ page }) => {
        await page.selectOption('.product_sort_container', 'za');

        const itemNames = await page.locator('.inventory_item_name').allTextContents()
        expect(itemNames.length).toBeGreaterThan(1);
        const expectedSortedNames = [...itemNames].sort((a, b) => b.toLowerCase().localeCompare(a.toLowerCase()))
        expect(itemNames).toEqual(expectedSortedNames);
    });

    test('inventory items are sorted by price (low to high)', async ({ page }) => {
        await page.pause()
        await page.selectOption('.product_sort_container', 'lohi');

        const priceTexts = await page.locator('.inventory_item_price').allTextContents();
        const prices = priceTexts.map(text => parseFloat(text.replace('$', '').trim()));
        expect(prices.length).toBeGreaterThan(1);
        const expectedSortedPrices = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(expectedSortedPrices);
    });

    test('inventory items are sorted by price (high to low)', async ({ page }) => {
        await page.pause()
        await page.selectOption('.product_sort_container', 'hilo');

        const priceTexts = await page.locator('.inventory_item_price').allTextContents();
        const prices = priceTexts.map(text => parseFloat(text.replace('$', '').trim()));
        expect(prices.length).toBeGreaterThan(1);
        const expectedSortedPrices = [...prices].sort((a, b) => b - a);
        expect(prices).toEqual(expectedSortedPrices);
    });

    test('Cart badge updates when removing an item from the inventory page', async ({ page }) => {
        const Inventory = new InventoryPage(page)
        await Inventory.AddItemToCart(env.products[0])
        await Inventory.AddItemToCart(env.products[2])
        await Inventory.AddItemToCart(env.products[3])
        const badgeCartPage = page.locator('.shopping_cart_badge');
        await expect(badgeCartPage, 'Cart badge should be visible when cart has items').toBeVisible();

        await page.pause()
        const badgeBeforeText = await badgeCartPage.textContent();
        expect(badgeBeforeText).not.toBeNull();

        const badgeBefore = parseInt(badgeBeforeText!.trim(), 10);
        expect(badgeBefore, 'Badge count should be > 0').toBeGreaterThan(0);

        const removeButtons = page.locator('button:has-text("Remove")');
        const removeCount = await removeButtons.count();
        expect(removeCount, 'Expected at least one "Remove" button on inventory page').toBeGreaterThan(0);

        await removeButtons.first().click();
        if (badgeBefore === 1) {
            await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
        } else {
            await expect(page.locator('.shopping_cart_badge')).toHaveText(String(badgeBefore - 1));
        }
    });
})

