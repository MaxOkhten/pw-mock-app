import { test, expect, request} from "@playwright/test";
import tags from '../test-data/tags.json';

test.beforeEach(async ({page}) => {
    //always configure mocks before the browser makes a call to the api
    await page.route('https://*/**/api/tags', async route => {

        await route.fulfill({
            body: JSON.stringify(tags)
        })
    })

    await page.goto('https://conduit.bondaracademy.com/');
    await page.getByText('Sign in').click();
    await page.getByRole('textbox', {name: "Email"}).fill('maxx@google.com');
    await page.getByRole('textbox', {name: "Password"}).fill('maxxmaxx');
    await page.getByRole('button').click()
    //await page.waitForTimeout(500) //important to wait to intercept
})

test("has title", async ({page}) => {
    //mock article
    await page.route('https://*/**/api/articles*', async route => {
        //complete the api call and return result
        const response = await route.fetch();
        const responseBody = await response.json()

        responseBody.articles[0].title = "Test title (mock)"
        responseBody.articles[0].description = "Some awesome description (mock)"

        await route.fulfill({
            body: JSON.stringify(responseBody)
        })
    })

    //trigger api call - refresh article list
    await page.getByText("Global Feed").click()

    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
    await expect(page.locator('app-article-list h1').first()).toContainText("Test title (mock)");
    await expect(page.locator('app-article-list p').first()).toContainText("Some awesome description (mock)");

})

test ('create article api -> delete article ui', async({page, request}) => {

    //get token
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {"user":{"email":"maxx@google.com","password":"maxxmaxx"}}
    });
    const responseBody = await response.json();
    const token = responseBody.user.token;

    const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {"article":{"title":"Article from request","description":"description of article","body":"Lorem ipsum...","tagList":["tag1", "tag2"]}},
        headers: {Authorization: `Token ${token}`}
    })

    expect(articleResponse.status()).toEqual(201);

    await page.getByText('GLobal Feed').click();
    await page.getByText('Article from request').click();
    await page.getByRole('button', {name: "Delete Article"}).first().click()

    await expect(page.locator('app-article-list h1').first()).not.toContainText("Article from request");
});


test("create article ui", async({page, request}) => {

    //get token
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {"user":{"email":"maxx@google.com","password":"maxxmaxx"}}
    });
    const responseBody = await response.json();
    const token = responseBody.user.token;

    await page.getByText("New Article").click();
    await page.getByRole("textbox", {name: "Article Title"}).fill("Hello");
    await page.getByRole("textbox", {name: "What's this article about?"}).fill("Lorem ipsum");
    await page.getByRole("textbox", {name: "Write your article (in markdown)"}).fill("Lorem ipsum dolor sit amet...");
    await page.getByRole("button", {name: "Publish Article"}).click();

    //intercept slugId of the article
    const articleResponse = await page.waitForResponse("https://conduit-api.bondaracademy.com/api/articles/");
    const articleRespBody = await articleResponse.json();
    const slug = articleRespBody.article.slug;

    await expect(page.locator(".article-page h1")).toContainText("Hello");
    await page.getByText("Home").click();
    await page.getByText("Global Feed").click();
    await expect(page.locator("app-article-list h1").first()).toContainText("Hello");

    //delete article via api
    const delArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slug}`, {
        headers: {Authorization: `Token ${token}`}
    });
    expect(delArticleResponse.status()).toEqual(204);

});






