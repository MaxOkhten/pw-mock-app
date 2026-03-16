import {test} from "../test-options.js";
import {PageManager} from "../page-objects/pageManager.js";
import {faker} from "@faker-js/faker";


test("Paramethrized methods", async({pageManager}) => {
    const randomFullName = faker.person.fullName();
    const randomEmail = `${randomFullName.replace(" ", "")}${faker.number.int(1000)}@test.com`;

    await pageManager.onFormLayoutsPage().submitUsingTheGridForm(process.env.USERNAME, process.env.PASSWORD, 'Option 1')
    await pageManager.onFormLayoutsPage().submitInlineForm(randomFullName, randomEmail, true);
})

