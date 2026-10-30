import { expect, test } from "@playwright/test";

test("adds a todo", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  await input.fill("Buy milk");
  await input.press("Enter");
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk"]);
  await expect(page.locator(".todo-count")).toHaveText("1 item left");
});

test("toggles and deletes only the chosen todo after an earlier delete", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  for (const title of ["One", "Two", "Three"]) {
    await input.fill(title);
    await input.press("Enter");
  }
  const items = page.locator(".todo-list li");
  await items.filter({ hasText: "One" }).hover();
  await items.filter({ hasText: "One" }).locator(".destroy").click();
  await input.fill("Four");
  await input.press("Enter");
  await expect(items).toHaveText(["Two", "Three", "Four"]);

  await items.filter({ hasText: "Four" }).locator(".toggle").check();
  await expect(items.filter({ hasText: "Three" }).locator(".toggle")).not.toBeChecked();
  await expect(page.locator(".todo-count")).toHaveText("2 items left");

  await items.filter({ hasText: "Four" }).hover();
  await items.filter({ hasText: "Four" }).locator(".destroy").click();
  await expect(items).toHaveText(["Two", "Three"]);
});

test("repairs duplicate ids saved by earlier versions", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    const saved = [
      { id: 2, title: "Two", completed: false },
      { id: 3, title: "Three", completed: false },
      { id: 3, title: "Four", completed: false },
    ];
    window.localStorage.setItem("todos-nextjs", JSON.stringify(saved));
  });
  await page.reload();
  const items = page.locator(".todo-list li");
  await items.filter({ hasText: "Four" }).locator(".toggle").check();
  await expect(items.filter({ hasText: "Three" }).locator(".toggle")).not.toBeChecked();
  await expect(page.locator(".todo-count")).toHaveText("2 items left");
});
