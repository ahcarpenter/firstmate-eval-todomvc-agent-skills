import { expect, test } from "@playwright/test";

test("searches todos by title within the current filter", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  for (const title of ["Buy milk", "Buy bread", "Walk the dog"]) {
    await input.fill(title);
    await input.press("Enter");
  }
  await page.locator(".todo-list li").filter({ hasText: "Buy bread" }).locator(".toggle").check();

  const labels = page.locator(".todo-list li label");
  const search = page.getByLabel("Search");
  await search.fill("bUY");
  await expect(labels).toHaveText(["Buy milk", "Buy bread"]);
  await expect(page.locator(".todo-count")).toHaveText("2 items left");

  await page.getByRole("link", { name: "Active" }).click();
  await expect(page).toHaveURL(/\/active$/);
  await search.fill("buy");
  await expect(labels).toHaveText(["Buy milk"]);

  await search.fill("");
  await expect(labels).toHaveText(["Buy milk", "Walk the dog"]);
  await expect(page.locator(".todo-count")).toHaveText("2 items left");
});
