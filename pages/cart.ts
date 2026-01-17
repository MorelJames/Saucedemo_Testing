import { Locator, Page } from "@playwright/test"

export class CartPage {
    page: Page
    items_title: Locator

    constructor(page: Page) {
        this.page = page
        this.items_title = this.page.locator('[data-test="inventory-item-name"]')
    }

    async GetAllItemsInCart(): Promise<string[]> {
        const items: string[] = []
        for (const el of await this.items_title.elementHandles()) {
            items.push(await el.innerText())
        }
        return items;
    }
}