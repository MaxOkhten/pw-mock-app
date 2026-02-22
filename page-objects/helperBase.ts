import { Page, expect } from "@playwright/test";

export class HelperBase {
    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async waitFOrNumberOfSeconds(timeInSeconds: number) {
        await this.page.waitForTimeout(timeInSeconds * 1000)
    }
}