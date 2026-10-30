import { expect, test } from "@playwright/test";

test("adds a todo", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  await input.fill("Buy milk");
  await input.press("Enter");
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk"]);
  await expect(page.locator(".todo-count")).toHaveText("1 item left");
});

test("a todo added after a delete toggles and deletes on its own", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  for (const title of ["one", "two", "three"]) {
    await input.fill(title);
    await input.press("Enter");
  }
  const items = page.locator(".todo-list li");
  await items.filter({ hasText: "two" }).hover();
  await items.filter({ hasText: "two" }).locator(".destroy").click();
  await input.fill("four");
  await input.press("Enter");
  await expect(items).toHaveText(["one", "three", "four"]);

  await items.filter({ hasText: "four" }).locator(".toggle").check();
  await expect(page.locator(".todo-list li.completed")).toHaveText(["four"]);

  await items.filter({ hasText: "four" }).hover();
  await items.filter({ hasText: "four" }).locator(".destroy").click();
  await expect(items).toHaveText(["one", "three"]);
});

test("duplicates a todo below the original, and the copy is its own todo that persists", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  for (const title of ["one", "two"]) {
    await input.fill(title);
    await input.press("Enter");
  }
  const items = page.locator(".todo-list li");
  await items.filter({ hasText: "one" }).locator(".toggle").check();
  await items.filter({ hasText: "one" }).hover();
  await items.filter({ hasText: "one" }).getByRole("button", { name: "Duplicate" }).click();
  await expect(items).toHaveText(["one", "one", "two"]);
  await expect(page.locator(".todo-list li.completed")).toHaveCount(1);
  await expect(items.nth(1)).not.toHaveClass(/completed/);

  await items.nth(1).locator(".toggle").check();
  await expect(page.locator(".todo-list li.completed")).toHaveCount(2);
  await items.nth(1).locator(".toggle").uncheck();

  await page.reload();
  await expect(items).toHaveText(["one", "one", "two"]);
  await expect(items.nth(0)).toHaveClass(/completed/);
  await expect(items.nth(1)).not.toHaveClass(/completed/);

  await items.nth(1).hover();
  await items.nth(1).locator(".destroy").click();
  await expect(items).toHaveText(["one", "two"]);
  await expect(items.nth(0)).toHaveClass(/completed/);
});
