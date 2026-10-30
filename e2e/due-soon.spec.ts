import { expect, test } from "@playwright/test";

// Auckland is ahead of UTC, so its calendar is already on the next day.
test.use({ timezoneId: "Pacific/Auckland" });

test("says today and tomorrow by the user's own calendar", async ({ page }) => {
  // 12:00 UTC on Oct 30 is 01:00 on Oct 31 in Auckland.
  await page.clock.setFixedTime(new Date("2026-10-30T12:00:00Z"));
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  const dueDate = page.getByLabel("Due date");

  for (const [title, due] of [
    ["Pay rent", "2026-10-30"],
    ["Buy milk", "2026-10-31"],
    ["Call mom", "2026-11-01"],
    ["File taxes", "2026-11-02"],
  ]) {
    await input.fill(title);
    await dueDate.fill(due);
    await input.press("Enter");
  }

  const items = page.locator(".todo-list li");
  const expected = ["Pay rentDue Oct 30Overdue", "Buy milkDue today", "Call momDue tomorrow", "File taxesDue Nov 2"];
  await expect(items).toHaveText(expected);

  await page.reload();
  await expect(items).toHaveText(expected);
});
