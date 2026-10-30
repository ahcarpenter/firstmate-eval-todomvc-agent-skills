import { expect, test, type Page } from "@playwright/test";

async function addTodos(page: Page, titles: string[]) {
  const input = page.getByPlaceholder("What needs to be done?");
  for (const title of titles) {
    await input.fill(title);
    await input.press("Enter");
  }
}

async function deleteTodo(page: Page, title: string) {
  const item = page.locator(".todo-list li").filter({ hasText: title });
  await item.hover();
  await item.locator(".destroy").click();
}

test("undoes a delete in place", async ({ page }) => {
  await page.goto("/");
  await addTodos(page, ["Buy milk", "Walk the dog", "Read a book"]);
  await deleteTodo(page, "Walk the dog");
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk", "Read a book"]);
  await expect(page.getByRole("status")).toContainText("Deleted “Walk the dog”");

  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk", "Walk the dog", "Read a book"]);
  await expect(page.getByRole("status")).toHaveCount(0);
  await page.reload();
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk", "Walk the dog", "Read a book"]);
});

test("restores the last todo after the list empties", async ({ page }) => {
  await page.goto("/");
  await addTodos(page, ["Buy milk"]);
  await deleteTodo(page, "Buy milk");
  await expect(page.locator(".todo-list li")).toHaveCount(0);
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk"]);
});

test("makes the delete final after the undo window", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await addTodos(page, ["Buy milk", "Walk the dog"]);
  await deleteTodo(page, "Buy milk");
  await expect(page.getByRole("button", { name: "Undo" })).toBeVisible();

  await page.clock.runFor(4_900);
  await expect(page.getByRole("button", { name: "Undo" })).toBeVisible();
  await page.clock.runFor(200);
  await expect(page.getByRole("button", { name: "Undo" })).toHaveCount(0);
  await expect(page.locator(".todo-list li")).toHaveText(["Walk the dog"]);
});
