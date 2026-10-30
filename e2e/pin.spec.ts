import { expect, test } from "@playwright/test";

test("pins todos to the top, across filters and reloads", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  for (const title of ["One", "Two", "Three", "Four"]) {
    await input.fill(title);
    await input.press("Enter");
  }
  const items = page.locator(".todo-list li");
  const item = (title: string) => items.filter({ hasText: title });

  await item("Three").hover();
  await item("Three").getByRole("button", { name: "Pin" }).click();
  await item("Four").hover();
  await item("Four").getByRole("button", { name: "Pin" }).click();
  await expect(items.locator("label")).toHaveText(["Three", "Four", "One", "Two"]);
  await expect(item("Three").getByRole("button", { name: "Unpin" })).toBeVisible();

  await item("Four").locator(".toggle").check();
  await item("Two").locator(".toggle").check();

  await page.reload();
  await expect(items.locator("label")).toHaveText(["Three", "Four", "One", "Two"]);

  await page.getByRole("link", { name: "Active" }).click();
  await expect(items.locator("label")).toHaveText(["Three", "One"]);
  await page.getByRole("link", { name: "Completed" }).click();
  await expect(items.locator("label")).toHaveText(["Four", "Two"]);

  await page.getByRole("link", { name: "All" }).click();
  await item("Three").getByRole("button", { name: "Unpin" }).click();
  await expect(items.locator("label")).toHaveText(["Four", "One", "Two", "Three"]);
});
