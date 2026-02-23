import { test, expect} from "@playwright/test";

test.beforeEach(async ({page}) => {
    await page.route('https://conduit-api.bondaracademy.com/api/tags', async route => {
        const tags = {
            "tags": [
                "automation",
                "playwright",
                "hello",
            ]
        }
        await route.fulfill({
            body: JSON.stringify(tags)
        })
    })

    await page.goto('https://conduit.bondaracademy.com/')
    await page.waitForTimeout(500)
})

test("hast title", async ({page}) => {
    await expect(page.locator('.navbar-brand')).toHaveText('conduit')
})