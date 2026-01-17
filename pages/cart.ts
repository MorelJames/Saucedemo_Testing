import { Locator, Page } from "@playwright/test"

export class CartPage {
    page: Page
    items_title: Locator
    checkout_Btn: Locator

    constructor(page: Page) {
        this.page = page
        this.items_title = this.page.locator('[data-test="inventory-item-name"]')
        this.checkout_Btn = this.page.locator('[data-test="checkout"]')
    }

    async GetAllItemsInCart(): Promise<string[]> {
        const items: string[] = []
        for (const el of await this.items_title.elementHandles()) {
            items.push(await el.innerText())
        }
        return items;
    }

    async GoToCheckout(){
        await this.checkout_Btn.click()
    }
}