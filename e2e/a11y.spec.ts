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

test("names every todo control", async ({ page }) => {
  await expect(page.getByRole("checkbox", { name: "Toggle Buy milk" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Edit Buy milk" })).toBeAttached();
  await expect(page.getByRole("button", { name: "Delete Buy milk" })).toBeAttached();
});

test("toggles a todo from the keyboard", async ({ page }) => {
  const toggle = page.getByRole("checkbox", { name: "Toggle Buy milk" });
  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(toggle).toBeChecked();
  await expect(page.locator(".todo-count")).toHaveText("0 items left");
});

test("edits a todo from the keyboard and returns focus", async ({ page }) => {
  await page.getByRole("checkbox", { name: "Toggle Buy milk" }).focus();
  await page.keyboard.press("Tab");
  const edit = page.getByRole("button", { name: "Edit Buy milk" });
  await expect(edit).toBeFocused();
  await expect(edit).toBeVisible();
  await page.keyboard.press("Enter");

  const field = page.getByRole("textbox", { name: "Edit Buy milk" });
  await expect(field).toBeFocused();
  await field.fill("Buy oat milk");
  await page.keyboard.press("Enter");

  await expect(page.locator(".todo-list li")).toHaveText(["Buy oat milk"]);
  await expect(page.getByRole("button", { name: "Edit Buy oat milk" })).toBeFocused();
});

test("cancels an edit with Escape and returns focus", async ({ page }) => {
  await page.getByRole("button", { name: "Edit Buy milk" }).focus();
  await page.keyboard.press("Enter");
  await page.getByRole("textbox", { name: "Edit Buy milk" }).fill("Something else");
  await page.keyboard.press("Escape");

  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk"]);
  await expect(page.getByRole("button", { name: "Edit Buy milk" })).toBeFocused();
});

test("deletes a todo from the keyboard", async ({ page }) => {
  await addTodo(page, "Walk the dog");
  await page.getByRole("button", { name: "Edit Buy milk" }).focus();
  await page.keyboard.press("Tab");
  const destroy = page.getByRole("button", { name: "Delete Buy milk" });
  await expect(destroy).toBeFocused();
  await expect(destroy).toBeVisible();
  await page.keyboard.press("Enter");

  await expect(page.locator(".todo-list li")).toHaveText(["Walk the dog"]);
  await expect(page.getByRole("textbox", { name: "New todo" })).toBeFocused();
});

test("marks the current filter", async ({ page }) => {
  await expect(page.getByRole("link", { name: "All" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("link", { name: "Active" })).not.toHaveAttribute("aria-current");
});
