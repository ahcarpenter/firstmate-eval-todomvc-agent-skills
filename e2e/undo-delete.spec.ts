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

test.beforeEach(async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await addTodos(page, ["Buy milk", "Walk the dog", "Pay rent"]);
});

test("undo puts a deleted todo back in its place", async ({ page }) => {
  await deleteTodo(page, "Walk the dog");
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk", "Pay rent"]);
  await expect(page.getByRole("status")).toContainText("Deleted “Walk the dog”");

  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk", "Walk the dog", "Pay rent"]);
  await expect(page.getByRole("status")).toHaveCount(0);

  await page.reload();
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk", "Walk the dog", "Pay rent"]);
});

test("the undo offer goes away after five seconds", async ({ page }) => {
  await deleteTodo(page, "Walk the dog");
  await page.mouse.move(0, 0);
  await page.clock.runFor(4900);
  await expect(page.getByRole("button", { name: "Undo" })).toBeVisible();
  await page.clock.runFor(200);
  await expect(page.getByRole("button", { name: "Undo" })).toHaveCount(0);
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk", "Pay rent"]);
});

test("the countdown waits while the undo button has focus", async ({ page }) => {
  await deleteTodo(page, "Walk the dog");
  await page.mouse.move(0, 0);
  await page.getByRole("button", { name: "Undo" }).focus();
  await page.clock.runFor(10_000);
  await page.keyboard.press("Enter");
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk", "Walk the dog", "Pay rent"]);
});

test("a second deletion replaces the first undo offer", async ({ page }) => {
  await deleteTodo(page, "Buy milk");
  await deleteTodo(page, "Pay rent");
  await expect(page.getByRole("status")).toHaveText(/Deleted “Pay rent”/);
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.locator(".todo-list li")).toHaveText(["Walk the dog", "Pay rent"]);
});

test("undo works after the last todo is deleted", async ({ page }) => {
  await deleteTodo(page, "Buy milk");
  await deleteTodo(page, "Walk the dog");
  await deleteTodo(page, "Pay rent");
  await expect(page.locator(".todo-list li")).toHaveCount(0);
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.locator(".todo-list li")).toHaveText(["Pay rent"]);
});
