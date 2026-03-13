import {test, expect} from "@playwright/test";
import {PageManager} from "../page-objects/pageManager";
import {faker} from "@faker-js/faker";

// import {NavigationPage} from "../page-objects/navigationPage"
// import {FormLayoutsPage} from "../page-objects/formLayoutsPage"
// import {DatepickerPage} from "../page-objects/datePicker"

test.beforeEach(async({page}) => {
    await page.goto("/")
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

    //save a screenshot of the current state of the page
    await page.screenshot({path: "screenshots/formLayoutsPage.png"});
    const buffer = await page.screenshot(); //save the screenshot as a binary to the variable
    //console.log(buffer.toString("base64"));

    await pm.onFormLayoutsPage().submitInlineForm(randomFullName, randomEmail, true);

    //save a screenshot of the particular element of the page
    await page.locator("nb-card", {hasText: "Inline form"}).screenshot({path: "screenshots/inlineForm.png"});

    await pm.navigateTo().datepickerPage()
    await pm.onDatePickerPage().selectCommonDatepickerFromToday(5)
    await pm.onDatePickerPage().selectDatepickerWithRangeFromToday(6, 15)
})

