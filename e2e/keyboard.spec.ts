import { expect, test, type Page } from "@playwright/test";

async function addTodo(page: Page, title: string) {
  const input = page.getByRole("textbox", { name: "New todo" });
  await input.fill(title);
  await input.press("Enter");
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await addTodo(page, "Buy milk");
});

test("every todo control has an accessible name", async ({ page }) => {
  await expect(page.getByRole("checkbox", { name: "Buy milk" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Edit Buy milk" })).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Delete Buy milk" })).toHaveCount(1);
});

test("toggles a todo from the keyboard", async ({ page }) => {
  const checkbox = page.getByRole("checkbox", { name: "Buy milk" });
  await checkbox.focus();
  await page.keyboard.press("Space");
  await expect(checkbox).toBeChecked();
  await expect(page.locator(".todo-count")).toHaveText("0 items left");
});

test("edits a todo from the keyboard and returns focus", async ({ page }) => {
  const edit = page.getByRole("button", { name: "Edit Buy milk" });
  await edit.focus();
  await expect(edit).toBeVisible();
  await page.keyboard.press("Enter");

  const field = page.getByRole("textbox", { name: "Edit Buy milk" });
  await expect(field).toBeFocused();
  await field.fill("Buy oat milk");
  await field.press("Enter");

  await expect(page.locator(".todo-list li")).toHaveText(["Buy oat milk"]);
  await expect(page.getByRole("button", { name: "Edit Buy oat milk" })).toBeFocused();
});

test("cancels an edit with Escape and returns focus", async ({ page }) => {
  await page.getByRole("button", { name: "Edit Buy milk" }).focus();
  await page.keyboard.press("Enter");
  const field = page.getByRole("textbox", { name: "Edit Buy milk" });
  await field.fill("Something else");
  await field.press("Escape");

  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk"]);
  await expect(page.getByRole("button", { name: "Edit Buy milk" })).toBeFocused();
});

test("deletes a todo from the keyboard", async ({ page }) => {
  const destroy = page.getByRole("button", { name: "Delete Buy milk" });
  await destroy.focus();
  await expect(destroy).toBeVisible();
  await page.keyboard.press("Enter");

  await expect(page.locator(".todo-list li")).toHaveCount(0);
  await expect(page.getByRole("textbox", { name: "New todo" })).toBeFocused();
});

test("tab reaches toggle, edit, and delete in order", async ({ page }) => {
  await page.getByRole("checkbox", { name: "Buy milk" }).focus();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Edit Buy milk" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Delete Buy milk" })).toBeFocused();
});
