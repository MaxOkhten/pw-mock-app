import { test, expect} from "@playwright/test";
import tags from '../test-data/tags.json'

test.beforeEach(async ({page}) => {
    //always configure mocks before the browser makes a call to the api
    await page.route('https://*/**/api/tags', async route => {

        await route.fulfill({
            body: JSON.stringify(tags)
        })
    })

    await page.route('https://*/**/api/articles*', async route => {
        //complete the api call and return result
        const response = await route.fetch();
        const responseBody = await response.json()

        responseBody.articles[0].title = "Test title"
        responseBody.articles[0].description = "Some generic description"

        await route. fulfill({
            body: JSON.stringify(responseBody)
        })
    })

    await page.goto('https://conduit.bondaracademy.com/')
    await page.waitForTimeout(500) //important to wait to intercept
})

test("has title", async ({page}) => {
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
    await expect(page.locator('app-article-list h1').first()).toContainText("Test title");
    await expect(page.locator('app-article-list p').first()).toContainText("Some generic description");


})