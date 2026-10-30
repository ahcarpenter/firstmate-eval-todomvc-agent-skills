import { expect, test } from "@playwright/test";

test("marks, counts, and filters overdue todos", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 10, 5, 12));
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  const due = page.getByLabel("Due date");
  for (const [title, date] of [
    ["Pay rent", "2026-11-01"],
    ["Call mom", "2026-11-04"],
    ["Buy milk", "2026-11-05"],
    ["File taxes", "2026-11-03"],
  ]) {
    await due.fill(date);
    await input.fill(title);
    await input.press("Enter");
  }
  await page.locator(".todo-list li").filter({ hasText: "File taxes" }).locator(".toggle").check();

  const items = page.locator(".todo-list li");
  await expect(items.locator(".todo-overdue")).toHaveCount(2);
  await expect(items.filter({ hasText: "Pay rent" }).locator(".todo-overdue")).toHaveText("Overdue");
  await expect(items.filter({ hasText: "Buy milk" }).locator(".todo-overdue")).toHaveCount(0);
  await expect(page.locator(".overdue-count")).toHaveText("2 overdue");

  await page.getByRole("link", { name: "Overdue" }).click();
  await expect(page).toHaveURL(/\/overdue$/);
  await expect(page.getByRole("link", { name: "Overdue" })).toHaveClass("selected");
  await expect(items.locator("label")).toHaveText([/^Pay rent/, /^Call mom/]);

  await items.filter({ hasText: "Call mom" }).locator(".toggle").click();
  await expect(items).toHaveCount(1);
  await expect(page.locator(".overdue-count")).toHaveText("1 overdue");
});

test("snoozes an overdue todo to tomorrow", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 10, 5, 12));
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  const due = page.getByLabel("Due date");
  for (const [title, date] of [
    ["Pay rent", "2026-11-01"],
    ["Call mom", "2026-11-04"],
    ["File taxes", "2026-11-03"],
    ["Buy milk", "2026-11-05"],
  ]) {
    await due.fill(date);
    await input.fill(title);
    await input.press("Enter");
  }
  await input.fill("Walk the dog");
  await input.press("Enter");
  await page.locator(".todo-list li").filter({ hasText: "File taxes" }).locator(".toggle").check();

  const items = page.locator(".todo-list li");
  const snooze = page.getByRole("button", { name: "Snooze" });
  await expect(snooze).toHaveCount(2);
  await expect(items.filter({ hasText: "Pay rent" }).locator(".snooze")).toHaveCount(1);

  await items.filter({ hasText: "Pay rent" }).locator(".snooze").click();
  const rent = items.filter({ hasText: "Pay rent" });
  await expect(rent.locator(".todo-due")).toHaveText("Due Nov 6");
  await expect(rent.locator(".snooze")).toHaveCount(0);
  await expect(snooze).toHaveCount(1);
  await expect(page.locator(".overdue-count")).toHaveText("1 overdue");

  await page.getByRole("link", { name: "Overdue" }).click();
  await expect(items.locator("label")).toHaveText([/^Call mom/]);
  await items.locator(".snooze").click();
  await expect(items).toHaveCount(0);
  await expect(page.locator(".overdue-count")).toHaveText("0 overdue");

  await page.reload();
  await expect(page.locator(".overdue-count")).toHaveText("0 overdue");
  await page.getByRole("link", { name: "All" }).click();
  await expect(items.filter({ hasText: "Call mom" }).locator(".todo-due")).toHaveText("Due Nov 6");
});
