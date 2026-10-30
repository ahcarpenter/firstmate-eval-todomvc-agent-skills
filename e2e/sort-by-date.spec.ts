import { expect, test } from "@playwright/test";

test("sorts todos by due date within every filter and remembers the choice", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  const dueDate = page.getByLabel("Due date");

  for (const [title, due] of [
    ["Buy milk", ""],
    ["Call mom", "2026-11-05"],
    ["Walk the dog", ""],
    ["Pay rent", "2026-11-01"],
    ["File taxes", "2026-11-05"],
  ]) {
    await input.fill(title);
    if (due) await dueDate.fill(due);
    await input.press("Enter");
  }

  const titles = page.locator(".todo-list li label");
  // Each label also shows the due date, as "Due Nov 1".
  const sort = page.getByLabel("Sort by date");
  const usual = ["Buy milk", "Call momDue Nov 5", "Walk the dog", "Pay rentDue Nov 1", "File taxesDue Nov 5"];
  const sorted = ["Pay rentDue Nov 1", "Call momDue Nov 5", "File taxesDue Nov 5", "Buy milk", "Walk the dog"];

  await expect(sort).not.toBeChecked();
  await expect(titles).toHaveText(usual);

  await sort.check();
  await expect(titles).toHaveText(sorted);

  await page.reload();
  await expect(sort).toBeChecked();
  await expect(titles).toHaveText(sorted);

  await page.locator(".todo-list li").filter({ hasText: "Call mom" }).locator(".toggle").check();
  await page.getByRole("link", { name: "Active" }).click();
  await expect(titles).toHaveText(["Pay rentDue Nov 1", "File taxesDue Nov 5", "Buy milk", "Walk the dog"]);

  await page.getByRole("link", { name: "Completed" }).click();
  await expect(titles).toHaveText(["Call momDue Nov 5"]);

  await page.getByRole("link", { name: "All" }).click();
  await sort.uncheck();
  await expect(titles).toHaveText(usual);

  await page.reload();
  await expect(sort).not.toBeChecked();
  await expect(titles).toHaveText(usual);
});
