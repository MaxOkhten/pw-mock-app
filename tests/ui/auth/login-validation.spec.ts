import { test, expect } from "@playwright/test";

// Login form — client-side validation

test.describe("Auth › Login form validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/login");
  });

  test("submit button is disabled while the form is empty", async ({ page }) => {
    const submitButton = page.getByRole("button", { name: "Log In" });

    await expect(submitButton).toBeDisabled();
  });

  test("shows required errors when fields are touched and left empty", async ({ page }) => {
    const email = page.getByLabel("Email address:");
    const password = page.getByLabel("Password:");

    await email.click();
    await password.click();
    await page.locator("h1#title").click();

    await expect(page.getByText("Email is required!")).toBeVisible();
    await expect(page.getByText("Password is required!")).toBeVisible();
  });
  
  test("rejects a malformed email without @", async ({ page }) => {
    const email = page.getByLabel("Email address:");

    await email.fill("not-an-email");
    await email.blur();

    await expect(page.getByText("Email should be the real one!")).toBeVisible();
  });

  test("rejects a malformed email without a domain part", async ({ page }) => {
    const email = page.getByLabel("Email address:");

    await email.fill("user@");
    await email.blur();

    await expect(page.getByText("Email should be the real one!")).toBeVisible();
  });

  test("accepts a well-formed email", async ({ page }) => {
    const email = page.getByLabel("Email address:");

    await email.fill("user@test.com");
    await email.blur();

    await expect(page.getByText("Email should be the real one!")).toBeHidden();
    await expect(page.getByText("Email is required!")).toBeHidden();
  });

});
