import {test, expect} from "@playwright/test"

test.beforeEach(async({page}) => {
    await page.goto("/")
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

test("User facing locators", async({page}) => {
    //by role
    await page.getByRole("textbox", {name: "Email"}).first().click()
    await page.getByRole("button", {name: "Sign in"}).first().click()

    //by label
    await page.getByLabel("Email").first().click()

    //by placeholder
    await page.getByPlaceholder("Password").first().click()

    //by text
    await page.getByText("Using the Grid").click()

    //by title
    await page.getByTitle("IoT Dashboard").click()

    //by test id (not truly user facing)
    //await page.getByTestId("")
})

test("Locating child elements", async({page}) => {
    //by chaining v1:
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    //by chaining v2:
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    //combine regular locator and user facing locator
    await page.locator("nb-card").getByRole("button", {name: "Sign in"}).first().click()

    //by index of element - the least preferable and unstable
    await page.locator("nb-card").nth(3).getByRole("button").click()
})

test("Locating parent elements", async({page}) => {
    //filtering by text
    await page.locator("nb-card", {hasText: "Using the Grid"}).getByRole("textbox", {name: "Email"}).click()
    await page.locator("nb-card").filter({hasText: "Basic form"}).getByRole("textbox", {name: "Email"}).click()

    //filtering by locator
    await page.locator("nb-card", {has: page.locator("#inputEmail1")}).getByRole("textbox", {name: "Email"}).click()
    await page.locator("nb-card", {has: page.locator(".status-danger")}).getByRole("textbox", {name: "Email"}).click()

    //by chaining filters
    await page.locator("nb-card").filter({has: page.locator("nb-checkbox")}).filter({hasText: "Sign in"})
        .getByRole("textbox", {name: "Email"}).first().click()
    
    //go one level up using xPath
    await page.locator(':text-is("Using the Grid")').locator("..").getByRole("textbox", {name: "Email"}).click()
})

test("Reusing locators", async({page}) => {
    //extract locator into a constant
    const basicForm = page.locator("nb-card").filter({hasText: "Basic form"})
    //second level of abstraction
    const emailField = basicForm.getByRole("textbox", {name: "Email"})

    await emailField.fill("hello@gmail.com")
    await basicForm.getByRole("textbox", {name: "Password"}).fill("123456")
    await basicForm.locator("nb-checkbox").click()
    await basicForm.getByRole("button").click()

    //assertion
    await expect(emailField).toHaveValue("hello@gmail.com")
})

test("Extracting values", async({page}) => {
    //single text value
    const basicForm = page.locator("nb-card").filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator("button").textContent()
    
    expect(buttonText).toEqual("Submit")

    //all text values
    const allRadioButtons = await page.locator("nb-radio").allTextContents()
    expect(allRadioButtons).toContain("Option 2")

    //input value
    const emailField = basicForm.getByRole("textbox", {name: "Email"})
    await emailField.fill("hello@gmail.com")

    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual("hello@gmail.com")

    //validate placeholder
    const placeholderValue = await emailField.getAttribute("placeholder")
    expect(placeholderValue).toEqual("Email")
})

test("Assertions", async({page}) => {
    const basicFormButton = page.locator("nb-card").filter({hasText: "Basic form"}).locator("button")

    //General assertions - will not wait for any conditions
    const value = 10
    expect(value).toEqual(10)

    const text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

    //Using locator assertions - can interact with the web elements, will wait for 5 secons to make an assertion
    await expect(basicFormButton).toHaveText("Submit")

    //Soft assertion - in case of fail the test still click the button
    await expect.soft(basicFormButton).toHaveText("Submittt")
    await basicFormButton.click()
})