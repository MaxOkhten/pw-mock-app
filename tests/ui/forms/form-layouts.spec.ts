import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { FormLayoutsPage } from "../../../page-objects/ui/formLayoutsPage";

//inline form tests
test.describe("Forms > Form Layouts > Inline form", () => {
  let formLayouts: FormLayoutsPage;

  test.beforeEach(async ({ page }) => {
    formLayouts = new FormLayoutsPage(page);
    await formLayouts.goto();
  });

  test("fill inline form with faker data and > check remember me", async () => {
    const name = faker.person.fullName();
    const email = faker.internet
      .email({ firstName: name.split(" ")[0] })
      .toLowerCase();

    await formLayouts.fillInlineForm({ name, email, rememberMe: true });

    await expect.soft(formLayouts.inlineNameInput).toHaveValue(name);
    await expect.soft(formLayouts.inlineEmailInput).toHaveValue(email);
    await expect.soft(formLayouts.inlineRememberMeCheckbox).toBeChecked();
    await expect.soft(formLayouts.inlineSubmitButton).toBeEnabled();
  });

  test("fill inline form with faker data and > uncheck remember me", async () => {
    const name = faker.person.fullName();
    const email = faker.internet.email().toLowerCase();

    await formLayouts.fillInlineForm({ name, email, rememberMe: false });

    await expect.soft(formLayouts.inlineNameInput).toHaveValue(name);
    await expect.soft(formLayouts.inlineEmailInput).toHaveValue(email);
    await expect.soft(formLayouts.inlineRememberMeCheckbox).not.toBeChecked();
  });
});

//grid form tests
test.describe("Forms > Form Layouts > Using the Grid", () => {
  let formLayouts: FormLayoutsPage;

  test.beforeEach(async ({ page }) => {
    formLayouts = new FormLayoutsPage(page);
    await formLayouts.goto();
  });

  test("fill grid form with email and password only", async () => {
    const email = faker.internet.email().toLowerCase();
    const password = faker.internet.password({ length: 12 });

    await formLayouts.fillGridForm({ email, password });

    await expect.soft(formLayouts.gridEmailInput).toHaveValue(email);
    await expect.soft(formLayouts.gridPasswordInput).toHaveValue(password);
    await expect.soft(formLayouts.gridSubmitButton).toBeEnabled();
  });
});
