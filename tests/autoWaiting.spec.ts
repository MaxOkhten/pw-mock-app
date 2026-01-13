import {test, expect} from "@playwright/test"

test.beforeEach(async({page}) => {
    await page.goto('http://uitestingplayground.com/ajax')
    await page.getByText('Button Triggering AJAX Request').click()
})

test('auto wating', async({page}) => {
    //will wait .click() for 30 seconds
    const successButton = page.locator('.bg-success')
    //await successButton.click()

    //will wait for .textContent() for 30 seconds
    //const content = await successButton.textContent()

    //won't wait for .allTextContents() at all
    //const content = await successButton.allTextContents()

    //wait untill successButton is attached
    //await successButton.waitFor({state: "attached"})
    //const content = await successButton.allTextContents()

    //optional timeout
    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})

test('alternative waits', async({page}) => {
    const successButton = page.locator('.bg-success')

    //wait for selector
    //await page.waitForSelector('.bg-success')

    //wait for response
    //await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    //wait for all network calls to be completed (not recommended)
    await page.waitForLoadState('networkidle')

    //manual waiting
    await page.waitForTimeout(50000)

    const content = await successButton.allTextContents()
    expect(content).toContain('Data loaded with AJAX get request.')
})