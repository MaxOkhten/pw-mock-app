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
})