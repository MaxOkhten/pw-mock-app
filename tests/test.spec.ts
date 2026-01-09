import {test} from "@playwright/test"

test.beforeEach(async({page}) => {
    await page.goto("http://localhost:4200/")
    await page.getByText("Forms").click()
    await page.getByText("Form Layouts").click()
})

test("Locator syntax rules", async({page}) => {
    //by Tag name
    page.locator("input")

    //by ID
    page.locator("#inputEmail1")

    //by Class value
    page.locator("shape-rectangle")

    //by attribute
    page.locator('[placeholder="Email"]')

    //combine selectors
    page.locator('input[placeholder="Email"]')

    //XPath
    page.locator('//*[@id="inputEmail1')

    //by text match
    page.locator('text-is("Using the Grid")')

    //by partial text match
    page.locator(':text("Using")')

})
