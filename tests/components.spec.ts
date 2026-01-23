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
    
test('lists and dropdowns', async({page}) => {
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    page.getByRole('list') // when UL tag
    page.getByRole('listitem') // when LI tag

    //const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('nb-option-list nb-option') // a bit shorter version

    //locate the list and click option
    await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate'])
    await optionList.filter({hasText: "Cosmic"}).click()

    //validate the background has been changed
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')


    //validate every color and every selection option
    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    await dropDownMenu.click()
    for(let color in colors) {
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        await page.waitForTimeout(1000)
        if(color !== "Corporate")
            await dropDownMenu.click() 
    }
})

test('tooltips', async({page}) => {
    //navigate to the tooltip
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
    await toolTipCard.getByRole('button', {name: 'Top'}).hover()

    page.getByRole('tooltip') //if a role tooltip present
    
    //validate the tooltip
    const toolTip = await page.locator('nb-tooltip').textContent()
})

test('dialog box', async({page}) => {
    //navigate to the tooltip
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //accept the dialog box
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })

    //identify the row and delete
    await page.getByRole('table').locator('tr', {hasText: 'twitter@outlook.com'}).locator('.nb-trash').click()
    
    //check that the row is deleted
    await expect(page.locator('table tr').nth(2)).not.toContainText('twitter@outlook.com')
})

test('tables', async({page}) => {
    //navigate to the tooltip
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    // 1) get the row by text in the row
    const targetRow = page.getByRole('row', {name: 'twitter@outlook.com'})
    await targetRow.locator('.nb-edit').click()

    //edit cell
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('123')
    await page.locator('.nb-checkmark').click()

    // 2) select column by id cell
    //navigate the pages of the table
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()

    //find row -> get 2 rows -> filter them by column to find what we need
    const targetID = page.getByRole('row', {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetID.locator('.nb-edit').click()

    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('hello@hello.com')
    await page.locator('.nb-checkmark').click()

    await expect(targetID.locator('td').nth(5)).toHaveText('hello@hello.com')


    // 3) loop through the table using filters of the table
    
    const ages = ["20", "30", "40", "200"];

    for (let age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear();
        await page.locator('input-filter').getByPlaceholder('Age').fill(age);
        await page.waitForTimeout(500)
        const ageRows = page.locator('tbody tr')

        for (let row of await ageRows.all()) {
            const cellValue = await row.locator('td').last().textContent()
            
            if(age == '200') {
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            } else {
                expect(cellValue).toEqual(age)
            }

        }
    }
})
