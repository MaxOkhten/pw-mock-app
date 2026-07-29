import {test, expect} from "@playwright/test";
import { argosScreenshot } from "@argos-ci/playwright";
import {PageManager} from "../page-objects/pageManager";
import {faker} from "@faker-js/faker";

// import {NavigationPage} from "../page-objects/navigationPage"
// import {FormLayoutsPage} from "../page-objects/formLayoutsPage"
// import {DatepickerPage} from "../page-objects/datePicker"

test.beforeEach(async({page}) => {
    await page.goto("/")
})

test("Go to form page @smoke @regression", async({page}) => {
    const pm = new PageManager(page)
    
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test("Paramethrized methods @smoke", async({page}) => {
    const pm = new PageManager(page);

    const randomFullName = faker.person.fullName();
    const randomEmail = `${randomFullName.replace(" ", "")}${faker.number.int(1000)}@test.com`;

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridForm(process.env.USERNAME, process.env.PASSWORD, 'Option 1')

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

test.only("Testing with Argos", async({page}) => {
    const pm = new PageManager(page)
    
    await pm.navigateTo().formLayoutsPage()
    await argosScreenshot(page, "form layouts page");

    await pm.navigateTo().datepickerPage()
    await argosScreenshot(page, "datepicker page");

})