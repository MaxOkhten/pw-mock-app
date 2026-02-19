import {test, expect} from "@playwright/test"
import {NavigationPage} from "../page-objects/navigationPage"
import {FormLayoutsPage} from "../page-objects/formLayoutsPage"
import {DatepickerPage} from "../page-objects/datePicker"

test.beforeEach(async({page}) => {
    await page.goto("http://localhost:4200/")
})

test("Go to form page", async({page}) => {
    const navigateTo = new NavigationPage(page)
    await navigateTo.formLayoutsPage()

    await navigateTo.datepickerPage()
    await navigateTo.smartTablePage()
    await navigateTo.toastrPage()
    await navigateTo.tooltipPage()
})

test("Paramethrized methods", async({page}) => {
    const navigateTo = new NavigationPage(page)
    const onFormLayoutsPage = new FormLayoutsPage(page)
    const onDatePickerPage = new DatepickerPage(page)
 
    await navigateTo.formLayoutsPage()
    await onFormLayoutsPage.submitUsingTheGridForm('hello@hello.com', 'P@s$w0rD', 'Option 1')
    await onFormLayoutsPage.submitInlineForm('Mister X', "mister@mister.com", true)
    
    await navigateTo.datepickerPage()
    await onDatePickerPage.selectCommonDatepickerFromToday(5)
    await onDatePickerPage.selectDatepickerWithRangeFromToday(6, 15)
})