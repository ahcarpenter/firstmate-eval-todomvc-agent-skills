import { expect, test } from "@playwright/test";

test("sorts todos by due date in every filter and keeps the choice", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 10, 5, 12));
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  const due = page.getByLabel("Due date");
  for (const [title, date] of [
    ["Buy milk", ""],
    ["File taxes", "2026-11-10"],
    ["Pay rent", "2026-11-01"],
    ["Walk the dog", ""],
    ["Call mom", "2026-11-10"],
  ]) {
    await due.fill(date);
    await input.fill(title);
    await input.press("Enter");
  }
  await page.locator(".todo-list li").filter({ hasText: "Call mom" }).locator(".toggle").check();

  const labels = page.locator(".todo-list li label");
  const sort = page.getByLabel("Sort by date");
  await expect(sort).not.toBeChecked();
  await expect(labels).toHaveText([/^Buy milk/, /^File taxes/, /^Pay rent/, /^Walk the dog/, /^Call mom/]);

  await sort.check();
  await expect(labels).toHaveText([/^Pay rent/, /^File taxes/, /^Call mom/, /^Buy milk/, /^Walk the dog/]);

  await page.reload();
  await expect(sort).toBeChecked();
  await expect(labels).toHaveText([/^Pay rent/, /^File taxes/, /^Call mom/, /^Buy milk/, /^Walk the dog/]);

  await page.getByRole("link", { name: "Active" }).click();
  await expect(labels).toHaveText([/^Pay rent/, /^File taxes/, /^Buy milk/, /^Walk the dog/]);

  await page.getByRole("link", { name: "Completed" }).click();
  await expect(labels).toHaveText([/^Call mom/]);

  await sort.uncheck();
  await page.getByRole("link", { name: "All" }).click();
  await expect(labels).toHaveText([/^Buy milk/, /^File taxes/, /^Pay rent/, /^Walk the dog/, /^Call mom/]);

  await page.reload();
  await expect(sort).not.toBeChecked();
});
