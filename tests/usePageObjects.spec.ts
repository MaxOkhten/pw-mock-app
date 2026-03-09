import {test, expect} from "@playwright/test";
import {PageManager} from "../page-objects/pageManager";
import {faker} from "@faker-js/faker";

// import {NavigationPage} from "../page-objects/navigationPage"
// import {FormLayoutsPage} from "../page-objects/formLayoutsPage"
// import {DatepickerPage} from "../page-objects/datePicker"

test.beforeEach(async({page}) => {
    await page.goto("http://localhost:4200/")
})

test("Go to form page", async({page}) => {
    const pm = new PageManager(page)
    
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test("Paramethrized methods", async({page}) => {
    const pm = new PageManager(page);

    const randomFullName = faker.person.fullName();
    const randomEmail = `${randomFullName.replace(" ", "")}${faker.number.int(1000)}@test.com`;

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridForm('hello@hello.com', 'P@s$w0rD', 'Option 1')
    await pm.onFormLayoutsPage().submitInlineForm(randomFullName, randomEmail, true)
    await pm.navigateTo().datepickerPage()
    await pm.onDatePickerPage().selectCommonDatepickerFromToday(5)
    await pm.onDatePickerPage().selectDatepickerWithRangeFromToday(6, 15)
})

