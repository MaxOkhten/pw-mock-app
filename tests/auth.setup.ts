import {test as setup} from "@playwright/test";

const authFile = "../.auth/user.json";

setup("authentication", async({page}) => {
    await page.goto('https://conduit.bondaracademy.com/');
    await page.getByText('Sign in').click();
    await page.getByRole('textbox', {name: "Email"}).fill('maxx@google.com');
    await page.getByRole('textbox', {name: "Password"}).fill('maxxmaxx');
    await page.getByRole('button').click();

    //check if fully logged in
    await page.waitForResponse("https://conduit-api.bondaracademy.com/api/tags");

    await page.context().storageState({path: authFile});
})