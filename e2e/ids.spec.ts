import { expect, test } from "@playwright/test";

test("toggling and deleting after a delete affect only one todo", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  for (const title of ["one", "two", "three"]) {
    await input.fill(title);
    await input.press("Enter");
  }
  const items = page.locator(".todo-list li");

  await items.filter({ hasText: "one" }).hover();
  await items.filter({ hasText: "one" }).getByRole("button", { name: "Delete" }).click();
  await input.fill("four");
  await input.press("Enter");
  await expect(items).toHaveText(["two", "three", "four"]);

  await items.filter({ hasText: "four" }).getByRole("checkbox").check();
  await expect(page.locator(".todo-list li.completed")).toHaveText(["four"]);

  await items.filter({ hasText: "four" }).hover();
  await items.filter({ hasText: "four" }).getByRole("button", { name: "Delete" }).click();
  await expect(items).toHaveText(["two", "three"]);
});

test("repairs duplicate ids already in storage", async ({ page }) => {
  await page.addInitScript(() => {
    if (window.localStorage.getItem("todos-nextjs")) return;
    window.localStorage.setItem(
      "todos-nextjs",
      JSON.stringify([
        { id: 2, title: "two", completed: false },
        { id: 2, title: "three", completed: false },
      ]),
    );
  });
  await page.goto("/");
  const items = page.locator(".todo-list li");
  await items.filter({ hasText: "three" }).getByRole("checkbox").check();
  await expect(page.locator(".todo-list li.completed")).toHaveText(["three"]);
});
