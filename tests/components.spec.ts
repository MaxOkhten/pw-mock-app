import {test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
})

test.describe('Form Layouts Test Suite', () => {
    test.beforeEach( async ({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async({page}) => {
        const emailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})

        await emailInput.fill('hello@gmail.com')
        await emailInput.clear()

        //simulate keystrokes
        await emailInput.pressSequentially('hello2@gmail.com', {delay: 200})

        //generic assetions - checks any value without auto-waiting
        const inputValue = await emailInput.inputValue()
        expect(inputValue).toEqual('hello2@gmail.com') 

        //locator assertions
        await expect(emailInput).toHaveValue('hello2@gmail.com')
    })

    test('radio buttons', async({page}) => {
        const usingTheGrid = page.locator('nb-card', {hasText: "Using the Grid"})

        //by Label
        await usingTheGrid.getByLabel('Option 1').check({force: true}) // {force: true} - if the label is hidden

        //by Role
        await usingTheGrid.getByRole('radio', {name: "Option 1"}).check({force: true})

        //validation - by role
        const radioStatus = await usingTheGrid.getByRole('radio', {name: "Option 1"}).isChecked()
        expect(radioStatus).toBeTruthy()

        //validation - locator assertion
        await expect(await usingTheGrid.getByRole('radio', {name: "Option 1"})).toBeChecked()

        //check that the option 1 is unchecked
        await usingTheGrid.getByRole('radio', {name: "Option 2"}).check({force: true})
        expect(await usingTheGrid.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
        expect(await usingTheGrid.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
    })
})

test('checkboxes', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()


    await page.getByRole('checkbox', {name: "Hide on click"}).check({force: true})
    await page.waitForTimeout(3000)
    await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true})
    await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true})

    //check all checkboxes on the page
    const allCheckboxes = page.getByRole('checkbox')
    for(const checkbox of await allCheckboxes.all()) {
        await checkbox.check({force: true})
        expect(await checkbox.isChecked()).toBeTruthy()
    }

    //uncheck all checkboxes on the page
    for(const checkbox of await allCheckboxes.all()) {
        await checkbox.uncheck({force: true})
        expect(await checkbox.isChecked()).toBeFalsy()
    }
})
    