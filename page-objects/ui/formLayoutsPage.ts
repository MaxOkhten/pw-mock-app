import { Page, Locator, expect } from "@playwright/test";


//Page Object for "Forms → Form Layouts" page.

export class FormLayoutsPage {
  readonly page: Page;

  //Inline form card
  readonly inlineFormCard: Locator;
  readonly inlineNameInput: Locator;
  readonly inlineEmailInput: Locator;
  readonly inlineRememberMeCheckbox: Locator;
  readonly inlineSubmitButton: Locator;

  //Using the Grid form card
  readonly gridFormCard: Locator;
  readonly gridEmailInput: Locator;
  readonly gridPasswordInput: Locator;
  readonly gridRadioGroup: Locator;
  readonly gridSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    //inline form card
    this.inlineFormCard = page
      .locator("nb-card")
      .filter({ hasText: "Inline form" });

    this.inlineNameInput = this.inlineFormCard.getByRole("textbox", {
      name: "Jane Doe",
    });
    this.inlineEmailInput = this.inlineFormCard.getByRole("textbox", {
      name: "Email",
    });
    this.inlineRememberMeCheckbox = this.inlineFormCard.getByRole("checkbox", {
      name: "Remember me",
    });
    this.inlineSubmitButton = this.inlineFormCard.getByRole("button", {
      name: "Submit",
    });

    //using the grid form card
    this.gridFormCard = page
      .locator("nb-card")
      .filter({ hasText: "Using the Grid" });

    this.gridEmailInput = this.gridFormCard.getByLabel("Email");
    this.gridPasswordInput = this.gridFormCard.getByLabel("Password");
    this.gridRadioGroup = this.gridFormCard.locator("nb-radio-group");
    this.gridSubmitButton = this.gridFormCard.getByRole("button", {
      name: "Sign in",
    });
  }

  async goto() {
    await this.page.goto("/pages/forms/layouts");
    await expect(this.inlineFormCard).toBeVisible();
  }

  async fillInlineForm(data: {
    name: string;
    email: string;
    rememberMe?: boolean;
  }) {
    await this.inlineNameInput.fill(data.name);
    await this.inlineEmailInput.fill(data.email);

    if (data.rememberMe) {
      await this.inlineRememberMeCheckbox.check({ force: true }); //force: true - to skip the actionability check
    }
  }

  async submitInlineForm() {
    await this.inlineSubmitButton.click();
  }

  async selectGridRadio(optionName: string) {
    const radio = this.gridRadioGroup.getByRole("radio", { name: optionName });
    await radio.check({ force: true });
  }

  async fillGridForm(data: {
    email: string;
    password: string;
    radioOption?: string;
  }) {
    await this.gridEmailInput.fill(data.email);
    await this.gridPasswordInput.fill(data.password);

    if (data.radioOption) {
      await this.selectGridRadio(data.radioOption);
    }
  }
}

