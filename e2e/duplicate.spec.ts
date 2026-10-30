import { expect, test } from "@playwright/test";

test("duplicates a todo right below it as its own todo, kept across reloads", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  for (const title of ["one", "two"]) {
    await input.fill(title);
    await input.press("Enter");
  }
  const items = page.locator(".todo-list li");

  await items.filter({ hasText: "one" }).getByRole("checkbox").check();
  await items.filter({ hasText: "one" }).hover();
  await items.filter({ hasText: "one" }).getByRole("button", { name: "Duplicate" }).click();
  await expect(items).toHaveText(["one", "one", "two"]);
  await expect(page.locator(".todo-list li.completed")).toHaveCount(1);
  await expect(items.nth(0)).toHaveClass("completed");

  await page.reload();
  await expect(items).toHaveText(["one", "one", "two"]);
  await expect(items.nth(1)).not.toHaveClass("completed");

  await items.nth(1).getByRole("checkbox").check();
  await expect(page.locator(".todo-list li.completed")).toHaveCount(2);
  await items.nth(0).hover();
  await items.nth(0).getByRole("button", { name: "Delete" }).click();
  await expect(items).toHaveText(["one", "two"]);
  await expect(items.nth(0)).toHaveClass("completed");
});
