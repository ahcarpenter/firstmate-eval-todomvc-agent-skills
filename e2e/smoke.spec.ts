import { expect, test } from "@playwright/test";

test("adds a todo", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  await input.fill("Buy milk");
  await input.press("Enter");
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk"]);
  await expect(page.locator(".todo-count")).toHaveText("1 item left");
});

// Pin "today" so due dates stay on the same side of it whenever the suite runs.
const TODAY = new Date(2026, 9, 29, 12);

test("adds a todo with a due date that survives a reload", async ({ page }) => {
  await page.clock.setFixedTime(TODAY);
  await page.goto("/");
  await page.getByLabel("Due date").fill("2026-11-03");
  const input = page.getByPlaceholder("What needs to be done?");
  await input.fill("Pay rent");
  await input.press("Enter");
  await input.fill("Buy milk");
  await input.press("Enter");
  await expect(page.locator(".todo-list li")).toHaveText(["Pay rentDue Nov 3", "Buy milk"]);
  await expect(page.getByLabel("Due date")).toHaveValue("");
  await page.reload();
  await expect(page.locator(".todo-list li .todo-due")).toHaveText(["Due Nov 3"]);
});

test("flags overdue todos, counts them, and filters to them", async ({ page }) => {
  await page.clock.setFixedTime(TODAY);
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  const due = page.getByLabel("Due date");
  for (const [title, date] of [
    ["Pay rent", "2026-10-28"],
    ["Book flights", "2026-10-29"],
    ["Renew passport", "2026-10-01"],
    ["Buy milk", ""],
  ]) {
    await due.fill(date);
    await input.fill(title);
    await input.press("Enter");
  }
  await expect(page.locator(".todo-list li .todo-overdue")).toHaveText(["Overdue", "Overdue"]);
  await expect(page.locator(".todo-count")).toHaveText("4 items left2 overdue");

  await page.getByRole("link", { name: "Overdue" }).click();
  await expect(page).toHaveURL("/overdue");
  await expect(page.locator(".todo-list li label")).toHaveText(["Pay rentDue Oct 28Overdue", "Renew passportDue Oct 1Overdue"]);

  await page.locator(".todo-list li").first().locator(".toggle").click();
  await expect(page.locator(".todo-list li label")).toHaveText(["Renew passportDue Oct 1Overdue"]);
  await expect(page.locator(".todo-count")).toHaveText("3 items left1 overdue");
});

test("snoozes an overdue todo to tomorrow", async ({ page }) => {
  await page.clock.setFixedTime(TODAY);
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  const due = page.getByLabel("Due date");
  for (const [title, date] of [
    ["Pay rent", "2026-10-28"],
    ["Book flights", "2026-11-03"],
  ]) {
    await due.fill(date);
    await input.fill(title);
    await input.press("Enter");
  }
  await expect(page.getByRole("button", { name: "Snooze" })).toHaveCount(1);

  await page.locator(".todo-list li").first().hover();
  await page.getByRole("button", { name: "Snooze" }).click();
  await expect(page.locator(".todo-list li label")).toHaveText(["Pay rentDue Oct 30", "Book flightsDue Nov 3"]);
  await expect(page.getByRole("button", { name: "Snooze" })).toHaveCount(0);
  await expect(page.locator(".todo-count")).toHaveText("2 items left");

  await page.reload();
  await expect(page.locator(".todo-list li .todo-due")).toHaveText(["Due Oct 30", "Due Nov 3"]);
});
