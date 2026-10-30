import { expect, test, type Page } from "@playwright/test";

const TITLES = ["Buy milk", "Walk the dog", "Pay rent", "Call mum"];

async function addTodos(page: Page, titles: string[]) {
  const input = page.getByPlaceholder("What needs to be done?");
  for (const title of titles) {
    await input.fill(title);
    await input.press("Enter");
  }
}

async function complete(page: Page, title: string) {
  await page.locator(".todo-list li").filter({ hasText: title }).locator(".toggle").check();
}

async function clearCompleted(page: Page) {
  await page.getByRole("button", { name: "Clear completed" }).click();
}

test.beforeEach(async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await addTodos(page, TITLES);
  await complete(page, "Buy milk");
  await complete(page, "Pay rent");
});

test("undo brings back every cleared todo in its place, still completed", async ({ page }) => {
  await clearCompleted(page);
  await expect(page.locator(".todo-list li")).toHaveText(["Walk the dog", "Call mum"]);
  await expect(page.getByRole("status")).toContainText("Cleared 2 completed todos");

  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.locator(".todo-list li")).toHaveText(TITLES);
  await expect(page.locator(".todo-list li.completed")).toHaveText(["Buy milk", "Pay rent"]);
  await expect(page.getByRole("status")).toHaveCount(0);

  await page.reload();
  await expect(page.locator(".todo-list li")).toHaveText(TITLES);
  await expect(page.locator(".todo-list li.completed")).toHaveText(["Buy milk", "Pay rent"]);
});

test("the message counts a single cleared todo", async ({ page }) => {
  await page.locator(".todo-list li").filter({ hasText: "Pay rent" }).locator(".toggle").uncheck();
  await clearCompleted(page);
  await expect(page.getByRole("status")).toContainText("Cleared 1 completed todo");
  await expect(page.getByRole("status")).not.toContainText("todos");
});

test("the undo offer goes away after five seconds", async ({ page }) => {
  await clearCompleted(page);
  await page.mouse.move(0, 0);
  await page.clock.runFor(4900);
  await expect(page.getByRole("button", { name: "Undo" })).toBeVisible();
  await page.clock.runFor(200);
  await expect(page.getByRole("button", { name: "Undo" })).toHaveCount(0);
  await expect(page.locator(".todo-list li")).toHaveText(["Walk the dog", "Call mum"]);
});

test("undo works from the completed filter after the list empties", async ({ page }) => {
  await page.goto("/completed");
  await clearCompleted(page);
  await expect(page.locator(".todo-list li")).toHaveCount(0);
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk", "Pay rent"]);
});

test("undo keeps a todo added while the offer was showing", async ({ page }) => {
  await clearCompleted(page);
  await addTodos(page, ["Read a book"]);
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.locator(".todo-list li")).toHaveText([...TITLES, "Read a book"]);
  await expect(page.locator(".todo-list li.completed")).toHaveText(["Buy milk", "Pay rent"]);
});

test("a second clear replaces the offer and restarts the countdown", async ({ page }) => {
  await clearCompleted(page);
  await page.mouse.move(0, 0);
  await page.clock.runFor(3000);
  await complete(page, "Call mum");
  await clearCompleted(page);
  await page.mouse.move(0, 0);
  await expect(page.getByRole("status")).toContainText("Cleared 1 completed todo");
  await page.clock.runFor(3000);
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.locator(".todo-list li")).toHaveText(["Walk the dog", "Call mum"]);
});

test("clearing replaces the undo offer for a deletion", async ({ page }) => {
  const item = page.locator(".todo-list li").filter({ hasText: "Call mum" });
  await item.hover();
  await item.locator(".destroy").click();
  await clearCompleted(page);
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk", "Walk the dog", "Pay rent"]);
});
