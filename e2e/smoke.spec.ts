import { expect, test } from "@playwright/test";

test("adds a todo", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  await input.fill("Buy milk");
  await input.press("Enter");
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk"]);
  await expect(page.locator(".todo-count")).toHaveText("1 item left");
});

test("shows how many todos are completed", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".completed-count")).toHaveCount(0);
  const input = page.getByPlaceholder("What needs to be done?");
  for (const title of ["Buy milk", "Walk the dog"]) {
    await input.fill(title);
    await input.press("Enter");
  }
  const completedCount = page.locator(".completed-count");
  await expect(completedCount).toHaveText("0 of 2 completed");
  await page.locator(".todo-list li .toggle").first().check();
  await expect(completedCount).toHaveText("1 of 2 completed");
  await page.getByRole("button", { name: "Clear completed" }).click();
  await expect(completedCount).toHaveText("0 of 1 completed");
});
