import { test, expect} from "@playwright/test";
import tags from '../test-data/tags.json'

test.beforeEach(async ({page}) => {
    //always configure mocks before the browser makes a call to the api
    await page.route('https://*/**/api/tags', async route => {

        await route.fulfill({
            body: JSON.stringify(tags)
        })
    })

    //mock article
    // await page.route('https://*/**/api/articles*', async route => {
    //     //complete the api call and return result
    //     const response = await route.fetch();
    //     const responseBody = await response.json()

    //     responseBody.articles[0].title = "Test title"
    //     responseBody.articles[0].description = "Some good description"

    //     await route. fulfill({
    //         body: JSON.stringify(responseBody)
    //     })
    // })

    await page.goto('https://conduit.bondaracademy.com/')
    await page.waitForTimeout(500) //important to wait to intercept
})

test("has title", async ({page}) => {
    //mock article
    await page.route('https://*/**/api/articles*', async route => {
        //complete the api call and return result
        const response = await route.fetch();
        const responseBody = await response.json()

        responseBody.articles[0].title = "Test title"
        responseBody.articles[0].description = "Some awesome description"

        await route. fulfill({
            body: JSON.stringify(responseBody)
        })
    })

    //trigger api call - refresh article list
    await page.getByText("Global Feed").click()

    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
    await expect(page.locator('app-article-list h1').first()).toContainText("Test title");
    await expect(page.locator('app-article-list p').first()).toContainText("Some awesome description");


})