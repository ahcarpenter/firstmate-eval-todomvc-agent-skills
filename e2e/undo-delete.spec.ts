import { expect, test, type Page } from "@playwright/test";

async function addTodos(page: Page, titles: string[]) {
  const input = page.getByPlaceholder("What needs to be done?");
  for (const title of titles) {
    await input.fill(title);
    await input.press("Enter");
  }
}

async function deleteTodo(page: Page, title: string) {
  const item = page.locator(".todo-list li", { hasText: title });
  await item.hover();
  await item.locator(".destroy").click();
}

test.beforeEach(async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await addTodos(page, ["Buy milk", "Walk the dog", "Read a book"]);
});

test("undo puts a deleted todo back in place", async ({ page }) => {
  await deleteTodo(page, "Walk the dog");
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk", "Read a book"]);
  await expect(page.getByRole("status")).toHaveText("Deleted “Walk the dog”Undo");

  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk", "Walk the dog", "Read a book"]);
  await expect(page.getByRole("button", { name: "Undo" })).toHaveCount(0);

  await page.reload();
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk", "Walk the dog", "Read a book"]);
});

test("undo is offered after deleting the last todo", async ({ page }) => {
  for (const title of ["Buy milk", "Walk the dog", "Read a book"]) await deleteTodo(page, title);
  await expect(page.locator(".todo-list")).toHaveCount(0);

  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.locator(".todo-list li")).toHaveText(["Read a book"]);
});

test("the undo offer expires after a few seconds", async ({ page }) => {
  await deleteTodo(page, "Walk the dog");
  await page.mouse.move(0, 0);
  await page.clock.runFor(4000);
  await expect(page.getByRole("button", { name: "Undo" })).toBeVisible();

  await page.clock.runFor(1500);
  await expect(page.getByRole("button", { name: "Undo" })).toHaveCount(0);
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk", "Read a book"]);
});

test("the undo offer waits while the pointer is on it", async ({ page }) => {
  await deleteTodo(page, "Walk the dog");
  await page.getByRole("button", { name: "Undo" }).hover();
  await page.clock.runFor(10_000);

  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk", "Walk the dog", "Read a book"]);
});

test("the undo offer waits while it has keyboard focus", async ({ page }) => {
  await deleteTodo(page, "Walk the dog");
  await page.mouse.move(0, 0);
  await page.getByRole("button", { name: "Undo" }).focus();
  await page.clock.runFor(10_000);

  await page.keyboard.press("Enter");
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk", "Walk the dog", "Read a book"]);
});
