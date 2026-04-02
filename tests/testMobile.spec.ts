import {test, expect} from "@playwright/test";

test("input fields mobile", async({page}, testInfo) => {

        await page.goto("/");

        //check if the test is run in mobile mode
        if(testInfo.project.name == "mobile") {
            await page.locator(".sidebar-toggle").click();
        }

        await page.getByText("Forms").click();
        await page.getByText("Form Layouts").click();

        //check if the test is run in mobile mode
        if(testInfo.project.name == "mobile") {
            await page.locator(".sidebar-toggle").click();
        }

        const emailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"});

        await emailInput.fill('hello@gmail.com');
        await emailInput.clear();

        //simulate keystrokes
        await emailInput.pressSequentially('hello2@gmail.com', {delay: 200});

        //generic assetions - checks any value without auto-waiting
        const inputValue = await emailInput.inputValue();
        expect(inputValue).toEqual('hello2@gmail.com');

        //locator assertions
        await expect(emailInput).toHaveValue('hello2@gmail.com');
    });