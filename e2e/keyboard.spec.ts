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
  await expect(page.getByRole("checkbox", { name: "Buy milk" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Edit Buy milk" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Delete Buy milk" })).toBeAttached();
});

test("toggles a todo with the keyboard", async ({ page }) => {
  const toggle = page.getByRole("checkbox", { name: "Buy milk" });
  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(toggle).toBeChecked();
  await expect(page.locator(".todo-count")).toHaveText("0 items left");
});

test("edits a todo with the keyboard and returns focus", async ({ page }) => {
  await page.getByRole("checkbox", { name: "Buy milk" }).focus();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Edit Buy milk" })).toBeFocused();
  await page.keyboard.press("Enter");

  const edit = page.getByRole("textbox", { name: "Edit Buy milk" });
  await expect(edit).toBeFocused();
  await edit.fill("Buy oat milk");
  await edit.press("Enter");

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

test("keeps focus where the user moved it when an edit ends on blur", async ({ page }) => {
  await page.getByRole("button", { name: "Edit Buy milk" }).dblclick();
  await page.getByRole("textbox", { name: "New todo" }).click();
  await expect(page.getByRole("textbox", { name: "New todo" })).toBeFocused();
});

test("deletes a todo with the keyboard", async ({ page }) => {
  await page.getByRole("button", { name: "Edit Buy milk" }).focus();
  await page.keyboard.press("Tab");
  const destroy = page.getByRole("button", { name: "Delete Buy milk" });
  await expect(destroy).toBeFocused();
  await expect(destroy).toHaveCSS("opacity", "1");
  await page.keyboard.press("Enter");
  await expect(page.locator(".todo-list li")).toHaveCount(0);
});
