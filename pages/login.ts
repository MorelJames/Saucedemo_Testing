import { Locator, Page } from "@playwright/test";
import { env } from '../tests/helpers/env';

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

    async Login() {
        await this.username_textbox.fill(env.username)
        await this.password_textbox.fill(env.password)
        await this.login_Btn.click()
    }
}