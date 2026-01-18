import { Locator, Page } from "@playwright/test";

export class LoginPage {
    page: Page
    username_textbox: Locator
    password_textbox: Locator
    login_Btn: Locator

    constructor(page: Page) {
        this.page = page
        this.username_textbox = this.page.locator('[data-test="username"]')
        this.password_textbox = page.locator('[data-test="password"]')
        this.login_Btn = page.locator('[data-test="login-button"]')
    }
    async GoToLoginPage() {
        await this.page.goto("https://www.saucedemo.com/")
    }
    async Login(username: string, password: string) {
        await this.username_textbox.fill(username)
        await this.password_textbox.fill(password)
        await this.login_Btn.click()
    }
}