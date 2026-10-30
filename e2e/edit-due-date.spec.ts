import { expect, test } from "@playwright/test";

test("changes, cancels, and clears a todo's due date while editing", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 9, 30, 12, 0));
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  await input.fill("Pay rent");
  await page.getByLabel("Due date").fill("2026-10-29");
  await input.press("Enter");

  const item = page.locator(".todo-list li").first();
  const title = item.locator(".edit");
  const changeDate = item.getByLabel("Change date");
  await expect(item).toHaveText("Pay rentDue Oct 29Overdue");

  // Enter in the date field saves the title and the new date, and overdue follows it.
  await item.locator("label").dblclick();
  await expect(changeDate).toHaveValue("2026-10-29");
  await title.fill("Pay the rent");
  await changeDate.fill("2026-11-05");
  await changeDate.press("Enter");
  await expect(item).toHaveText("Pay the rentDue Nov 5");
  await expect(page.locator(".overdue-count")).toHaveCount(0);

  // Escape cancels both fields.
  await item.locator("label").dblclick();
  await title.fill("Ignore me");
  await changeDate.fill("2026-10-01");
  await changeDate.press("Escape");
  await expect(item).toHaveText("Pay the rentDue Nov 5");

  // Enter in the title field saves an earlier date, which makes the todo overdue.
  await item.locator("label").dblclick();
  await changeDate.fill("2026-10-28");
  await title.press("Enter");
  await expect(item).toHaveText("Pay the rentDue Oct 28Overdue");
  await expect(page.locator(".overdue-count")).toHaveText("1 overdue");

  // Clearing the date field removes the date.
  await item.locator("label").dblclick();
  await changeDate.fill("");
  await title.press("Enter");
  await expect(item).toHaveText("Pay the rent");
  await expect(item.locator(".due-date")).toHaveCount(0);

  await page.reload();
  await expect(item).toHaveText("Pay the rent");
});

test("keeps editing when focus moves between the title and date fields", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  await input.fill("Buy milk");
  await input.press("Enter");

  const item = page.locator(".todo-list li").first();
  await item.locator("label").dblclick();
  await item.getByLabel("Change date").focus();
  await expect(item).toHaveClass("editing");
  await item.getByLabel("Change date").fill("2026-11-03");

  // Leaving both fields saves the edit.
  await input.focus();
  await expect(item).toHaveText("Buy milkDue Nov 3");
});
