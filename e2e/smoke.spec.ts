import { expect, test } from "@playwright/test";

test("adds a todo", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  await input.fill("Buy milk");
  await input.press("Enter");
  await expect(page.locator(".todo-list li label")).toHaveText(["Buy milk"]);
  await expect(page.locator(".todo-count")).toHaveText("1 item left");
});

test("pins a todo above the others and keeps it after reload", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  for (const title of ["First", "Second", "Third"]) {
    await input.fill(title);
    await input.press("Enter");
  }
  const items = page.locator(".todo-list li");

  await items.filter({ hasText: "Third" }).getByRole("button", { name: "Pin", exact: true }).click();
  await expect(items.locator("label")).toHaveText(["Third", "First", "Second"]);
  await expect(items.first().getByRole("button", { name: "Unpin", exact: true })).toBeVisible();

  await page.reload();
  await expect(items.locator("label")).toHaveText(["Third", "First", "Second"]);

  await items.filter({ hasText: "First" }).locator(".toggle").check();
  await page.getByRole("link", { name: "Active" }).click();
  await expect(items.locator("label")).toHaveText(["Third", "Second"]);
  await page.getByRole("link", { name: "Completed" }).click();
  await expect(items.locator("label")).toHaveText(["First"]);

  await page.getByRole("link", { name: "All" }).click();
  await items.filter({ hasText: "Third" }).getByRole("button", { name: "Unpin", exact: true }).click();
  await expect(items.locator("label")).toHaveText(["First", "Second", "Third"]);
});
