import { expect, test } from "@playwright/test";

test("searches todo titles within the current filter while the counter counts every active todo", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  for (const title of ["Buy milk", "Call mom", "Buy MILK chocolate", "Walk the dog"]) {
    await input.fill(title);
    await input.press("Enter");
  }
  await page.locator(".todo-list li").filter({ hasText: /^Buy milk$/ }).locator(".toggle").check();

  const titles = page.locator(".todo-list li label");
  const count = page.locator(".todo-count");
  const search = page.getByLabel("Search");

  await search.fill("mIlK");
  await expect(titles).toHaveText(["Buy milk", "Buy MILK chocolate"]);
  await expect(count).toHaveText("3 items left");

  // Each filter is its own page, so switching filters starts a fresh search.
  await page.getByRole("link", { name: "Active" }).click();
  await expect(page).toHaveURL(/\/active$/);
  await expect(search).toHaveValue("");
  await search.fill("milk");
  await expect(titles).toHaveText(["Buy MILK chocolate"]);
  await expect(count).toHaveText("3 items left");

  await page.getByRole("link", { name: "Completed" }).click();
  await expect(page).toHaveURL(/\/completed$/);
  await search.fill("milk");
  await expect(titles).toHaveText(["Buy milk"]);

  await search.fill("dog");
  await expect(titles).toHaveCount(0);
  await expect(count).toHaveText("3 items left");

  await search.fill("");
  await expect(titles).toHaveText(["Buy milk"]);

  await page.getByRole("link", { name: "All" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(titles).toHaveText(["Buy milk", "Call mom", "Buy MILK chocolate", "Walk the dog"]);
});
