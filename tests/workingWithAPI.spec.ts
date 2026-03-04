import { test, expect, request} from "@playwright/test";
//import tags from '../test-data/tags.json';

// test.beforeEach(async ({page}) => {
//     //always configure mocks before the browser makes a call to the api
//     await page.route('https://*/**/api/tags', async route => {

//         await route.fulfill({
//             body: JSON.stringify(tags)
//         })
//     })

//     //mock article
//     // await page.route('https://*/**/api/articles*', async route => {
//     //     //complete the api call and return result
//     //     const response = await route.fetch();
//     //     const responseBody = await response.json()

//     //     responseBody.articles[0].title = "Test title"
//     //     responseBody.articles[0].description = "Some good description"

//     //     await route. fulfill({
//     //         body: JSON.stringify(responseBody)
//     //     })
//     // })

//     await page.goto('https://conduit.bondaracademy.com/')
//     await page.waitForTimeout(500) //important to wait to intercept
// })

test("has title", async ({page}) => {
    //mock article
    await page.route('https://*/**/api/articles*', async route => {
        //complete the api call and return result
        const response = await route.fetch();
        const responseBody = await response.json()

        responseBody.articles[0].title = "Test title (mock)"
        responseBody.articles[0].description = "Some awesome description (mock)"

        await route. fulfill({
            body: JSON.stringify(responseBody)
        })
    })

    //trigger api call - refresh article list
    await page.getByText("Global Feed").click()

    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
    await expect(page.locator('app-article-list h1').first()).toContainText("Test title (mock)");
    await expect(page.locator('app-article-list p').first()).toContainText("Some awesome description (mock)");


})

test ('delete article', async({page, request}) => {
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {"user":{"email":"maxx@google.com","password":"maxxmaxx"}}
    });

    const responseBody = await response.json();
    const token = responseBody.user.token;

    await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {"article":{"title":"Article from request","description":"description of article","body":"Lorem ipsum...","tagList":["tag1", "tag2"]}},
        headers: {Authorization: `Token ${token}`}
    })
})



// email
// : 
// "maxx@google.com"
// password
// : 
// "maxxmaxx"
// username
// : 
// "Maxxxx"