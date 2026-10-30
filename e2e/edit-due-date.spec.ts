import { expect, test, type Page } from "@playwright/test";

async function addTodo(page: Page, title: string, due = "") {
  await page.getByLabel("Due date").fill(due);
  const input = page.getByPlaceholder("What needs to be done?");
  await input.fill(title);
  await input.press("Enter");
}

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 10, 5, 12));
  await page.goto("/");
});

test("shows the due date while editing and saves a new one with Enter in the date field", async ({ page }) => {
  await addTodo(page, "Pay rent", "2026-11-10");
  const item = page.locator(".todo-list li");
  await item.locator("label").dblclick();

  const changeDate = page.getByLabel("Change date");
  await expect(changeDate).toHaveValue("2026-11-10");
  await changeDate.fill("2026-11-01");
  await changeDate.press("Enter");

  await expect(changeDate).toHaveCount(0);
  await expect(item.locator(".todo-due")).toHaveText("Due Nov 1Overdue");
  await expect(page.locator(".overdue-count")).toHaveText("1 overdue");

  await page.reload();
  await expect(item.locator(".todo-due")).toHaveText("Due Nov 1Overdue");
});

test("saves the title and the date with Enter in the title field", async ({ page }) => {
  await addTodo(page, "Pay rent", "2026-11-01");
  const item = page.locator(".todo-list li");
  await expect(page.locator(".overdue-count")).toHaveText("1 overdue");
  await item.locator("label").dblclick();

  await item.locator(".edit").fill("Pay the rent");
  await page.getByLabel("Change date").fill("2026-11-12");
  await item.locator(".edit").press("Enter");

  await expect(item.locator("label")).toHaveText("Pay the rentDue Nov 12");
  await expect(item.locator(".todo-overdue")).toHaveCount(0);
  await expect(page.locator(".overdue-count")).toHaveText("0 overdue");
});

test("adds a date to a todo that had none", async ({ page }) => {
  await addTodo(page, "Buy milk");
  const item = page.locator(".todo-list li");
  await item.locator("label").dblclick();

  const changeDate = page.getByLabel("Change date");
  await expect(changeDate).toHaveValue("");
  await changeDate.fill("2026-11-07");
  await changeDate.press("Enter");

  await expect(item.locator(".todo-due")).toHaveText("Due Nov 7");
});

test("cancels the title and the date with Escape", async ({ page }) => {
  await addTodo(page, "Pay rent", "2026-11-10");
  const item = page.locator(".todo-list li");
  await item.locator("label").dblclick();

  await item.locator(".edit").fill("Pay the rent");
  const changeDate = page.getByLabel("Change date");
  await changeDate.fill("2026-11-01");
  await changeDate.press("Escape");

  await expect(changeDate).toHaveCount(0);
  await expect(item.locator("label")).toHaveText("Pay rentDue Nov 10");
  await expect(page.locator(".overdue-count")).toHaveText("0 overdue");

  await page.reload();
  await expect(item.locator("label")).toHaveText("Pay rentDue Nov 10");
});

test("removes the date when the date field is cleared", async ({ page }) => {
  await addTodo(page, "Pay rent", "2026-11-01");
  const item = page.locator(".todo-list li");
  await item.locator("label").dblclick();

  const changeDate = page.getByLabel("Change date");
  await changeDate.fill("");
  await changeDate.press("Enter");

  await expect(item.locator(".todo-due")).toHaveCount(0);
  await expect(page.locator(".overdue-count")).toHaveText("0 overdue");

  await page.reload();
  await expect(item.locator(".todo-due")).toHaveCount(0);
});
