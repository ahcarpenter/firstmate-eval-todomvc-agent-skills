import { expect, test, type Page } from "@playwright/test";

async function addTodos(page: Page, titles: string[]) {
  const input = page.getByPlaceholder("What needs to be done?");
  for (const title of titles) {
    await input.fill(title);
    await input.press("Enter");
  }
}

async function complete(page: Page, title: string) {
  await page.locator(".todo-list li", { hasText: title }).locator(".toggle").check();
}

test.beforeEach(async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await addTodos(page, ["Buy milk", "Walk the dog", "Read a book", "Call mum"]);
  await complete(page, "Buy milk");
  await complete(page, "Read a book");
});

test("undo brings back every cleared todo in place and still completed", async ({ page }) => {
  await page.getByRole("button", { name: "Clear completed" }).click();
  await expect(page.locator(".todo-list li")).toHaveText(["Walk the dog", "Call mum"]);
  await expect(page.getByRole("status")).toHaveText("Cleared 2 completed todosUndo");

  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk", "Walk the dog", "Read a book", "Call mum"]);
  await expect(page.locator(".todo-list li.completed")).toHaveText(["Buy milk", "Read a book"]);
  await expect(page.getByRole("button", { name: "Undo" })).toHaveCount(0);

  await page.reload();
  await expect(page.locator(".todo-list li.completed")).toHaveText(["Buy milk", "Read a book"]);
});

test("undo is offered after clearing every todo", async ({ page }) => {
  await complete(page, "Walk the dog");
  await complete(page, "Call mum");
  await page.getByRole("button", { name: "Clear completed" }).click();
  await expect(page.locator(".todo-list")).toHaveCount(0);

  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk", "Walk the dog", "Read a book", "Call mum"]);
});

test("the clear undo offer expires after a few seconds", async ({ page }) => {
  await page.getByRole("button", { name: "Clear completed" }).click();
  await page.mouse.move(0, 0);
  await page.clock.runFor(4000);
  await expect(page.getByRole("button", { name: "Undo" })).toBeVisible();

  await page.clock.runFor(1500);
  await expect(page.getByRole("button", { name: "Undo" })).toHaveCount(0);
  await expect(page.locator(".todo-list li")).toHaveText(["Walk the dog", "Call mum"]);
});
