import { expect, test } from "@playwright/test";

test("marks overdue todos, filters them, and counts them in the footer", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 9, 30, 12, 0));
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  const dueDate = page.getByLabel("Due date");

  for (const [title, due] of [
    ["Pay rent", "2026-10-29"],
    ["File taxes", "2026-10-01"],
    ["Call mom", "2026-10-30"],
    ["Buy milk", ""],
  ]) {
    await input.fill(title);
    if (due) await dueDate.fill(due);
    await input.press("Enter");
  }

  const items = page.locator(".todo-list li");
  await expect(items.locator(".overdue-label")).toHaveText(["Overdue", "Overdue"]);
  await expect(items.filter({ hasText: "Call mom" }).locator(".overdue-label")).toHaveCount(0);
  await expect(page.locator(".todo-count")).toHaveText("4 items left2 overdue");

  await items.filter({ hasText: "File taxes" }).locator(".toggle").check();
  await expect(page.locator(".overdue-count")).toHaveText("1 overdue");

  await page.getByRole("link", { name: "Overdue" }).click();
  await expect(page).toHaveURL(/\/overdue$/);
  await expect(page.getByRole("link", { name: "Overdue" })).toHaveClass("selected");
  await expect(items).toHaveText(["Pay rentDue Oct 29Overdue"]);

  await page.reload();
  await expect(items).toHaveText(["Pay rentDue Oct 29Overdue"]);

  // Completing the todo removes it from this filter, so click rather than check.
  await items.locator(".toggle").click();
  await expect(items).toHaveCount(0);
  await expect(page.locator(".overdue-count")).toHaveCount(0);
});
