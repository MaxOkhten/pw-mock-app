import { Page, Locator, expect } from "@playwright/test";


//Page Object for "Forms → Form Layouts" page.

export class FormLayoutsPage {
  readonly page: Page;

  readonly inlineFormCard: Locator;
  readonly inlineNameInput: Locator;
  readonly inlineEmailInput: Locator;
  readonly inlineRememberMeCheckbox: Locator;
  readonly inlineSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;

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
}

