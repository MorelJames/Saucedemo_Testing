import { Locator, Page } from "@playwright/test";

export class InventoryPage{
    page : Page
    cart_Btn : Locator

    constructor (page : Page){
        this.page = page
        this.cart_Btn = page.locator('[data-test="shopping-cart-link"]')
    }

    async AddItemToCart(item : string){
        await this.page.locator('[data-test="add-to-cart-'+item+'"]').click()
    }

    async RemoveItemFromCart(item : string){
        await this.page.locator('[data-test="remove-'+item+'"]').click()
    }

    async GoToCart(){
        this.cart_Btn.click()
    }
}