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

test("sorts by due date within each filter and keeps the choice across reloads", async ({ page }) => {
  await page.clock.setFixedTime(TODAY);
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  const due = page.getByLabel("Due date");
  for (const [title, date] of [
    ["Buy milk", ""],
    ["Book flights", "2026-11-10"],
    ["Pay rent", "2026-11-03"],
    ["Walk the dog", ""],
    ["File taxes", "2026-11-03"],
  ]) {
    await due.fill(date);
    await input.fill(title);
    await input.press("Enter");
  }
  const titles = page.locator(".todo-list li label");
  const usual = ["Buy milk", "Book flightsDue Nov 10", "Pay rentDue Nov 3", "Walk the dog", "File taxesDue Nov 3"];
  const byDate = ["Pay rentDue Nov 3", "File taxesDue Nov 3", "Book flightsDue Nov 10", "Buy milk", "Walk the dog"];
  const sortByDate = page.getByLabel("Sort by date");
  await expect(sortByDate).not.toBeChecked();
  await expect(titles).toHaveText(usual);

  await sortByDate.check();
  await expect(titles).toHaveText(byDate);
  await page.reload();
  await expect(sortByDate).toBeChecked();
  await expect(titles).toHaveText(byDate);

  await page.locator(".todo-list li", { hasText: "Pay rent" }).locator(".toggle").click();
  await page.getByRole("link", { name: "Active" }).click();
  await expect(page).toHaveURL("/active");
  await expect(titles).toHaveText(["File taxesDue Nov 3", "Book flightsDue Nov 10", "Buy milk", "Walk the dog"]);

  await sortByDate.uncheck();
  await expect(titles).toHaveText(["Buy milk", "Book flightsDue Nov 10", "Walk the dog", "File taxesDue Nov 3"]);
  await page.reload();
  await expect(sortByDate).not.toBeChecked();
});

test.describe("editing a todo's due date", () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(TODAY);
    await page.goto("/");
    await page.getByLabel("Due date").fill("2026-11-03");
    const input = page.getByPlaceholder("What needs to be done?");
    await input.fill("Pay rent");
    await input.press("Enter");
    await page.locator(".todo-list li label").dblclick();
  });

  test("shows the due date and saves it with the title on Enter", async ({ page }) => {
    const changeDate = page.getByLabel("Change date");
    await expect(changeDate).toHaveValue("2026-11-03");
    await page.locator(".todo-list li .edit").fill("Pay the rent");
    await changeDate.fill("2026-10-28");
    await changeDate.press("Enter");
    await expect(page.locator(".todo-list li label")).toHaveText(["Pay the rentDue Oct 28Overdue"]);
    await expect(page.locator(".todo-count")).toHaveText("1 item left1 overdue");
    await page.reload();
    await expect(page.locator(".todo-list li label")).toHaveText(["Pay the rentDue Oct 28Overdue"]);
  });

  test("saves from the title field and clears the date when emptied", async ({ page }) => {
    await page.getByLabel("Change date").fill("");
    await page.locator(".todo-list li .edit").press("Enter");
    await expect(page.locator(".todo-list li label")).toHaveText(["Pay rent"]);
    await page.reload();
    await expect(page.locator(".todo-list li .todo-due")).toHaveCount(0);
  });

  test("saves both fields when focus leaves the todo", async ({ page }) => {
    await page.getByLabel("Change date").fill("2026-11-10");
    await page.getByRole("heading", { name: "todos" }).click();
    await expect(page.locator(".todo-list li label")).toHaveText(["Pay rentDue Nov 10"]);
  });

  test("cancels both changes on Escape", async ({ page }) => {
    await page.locator(".todo-list li .edit").fill("Pay the rent");
    const changeDate = page.getByLabel("Change date");
    await changeDate.fill("2026-10-28");
    await changeDate.press("Escape");
    await expect(page.locator(".todo-list li label")).toHaveText(["Pay rentDue Nov 3"]);
    await page.locator(".todo-list li label").dblclick();
    await expect(page.getByLabel("Change date")).toHaveValue("2026-11-03");
  });
});

test.describe("due-soon labels", () => {
  // Late evening in Los Angeles is already the next day in UTC, so the labels must follow the local calendar.
  test.use({ timezoneId: "America/Los_Angeles" });

  test("says today and tomorrow by the viewer's calendar", async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-10-29T23:30:00-07:00"));
    await page.goto("/");
    const input = page.getByPlaceholder("What needs to be done?");
    const due = page.getByLabel("Due date");
    for (const [title, date] of [
      ["Pay rent", "2026-10-29"],
      ["Book flights", "2026-10-30"],
      ["Renew passport", "2026-10-31"],
    ]) {
      await due.fill(date);
      await input.fill(title);
      await input.press("Enter");
    }
    await expect(page.locator(".todo-list li .todo-due")).toHaveText(["Due today", "Due tomorrow", "Due Oct 31"]);
  });
});
