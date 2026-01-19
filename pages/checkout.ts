import { Locator, Page } from "@playwright/test"

export class CheckoutPage {
    page: Page
    continue_Btn: Locator
    first_Name: Locator
    last_name: Locator
    postal_Code: Locator
    finish_Btn: Locator
    cancel_Btn: Locator
    backHome_Btn: Locator

    constructor(page: Page) {
        this.page = page
        this.continue_Btn = this.page.locator('[data-test="continue"]')
        this.first_Name = this.page.locator('[data-test="firstName"]')
        this.last_name = this.page.locator('[data-test="lastName"]')
        this.postal_Code = this.page.locator('[data-test="postalCode"]')
        this.finish_Btn = this.page.locator('[data-test="finish"]')
        this.cancel_Btn = this.page.locator('[data-test="cancel"]')
        this.backHome_Btn = this.page.locator('[data-test="back-to-products"]')
    }

    async FillInformation(firstName: string, lastName: string, postalCode: string) {
        await this.first_Name.fill(firstName)
        await this.last_name.fill(lastName)
        await this.postal_Code.fill(postalCode)
    }

    async Continue() {
        await this.continue_Btn.click()
    }

    async Finish() {
        await this.finish_Btn.click()
    }

    async Cancel() {
        await this.cancel_Btn.click()
    }

    async BackHome() {
        await this.backHome_Btn.click()
    }
}