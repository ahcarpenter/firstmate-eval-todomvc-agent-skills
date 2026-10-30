import { expect, test } from "@playwright/test";

test("pins todos above the rest, across filters and reloads", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder("What needs to be done?");
  for (const title of ["One", "Two", "Three"]) {
    await input.fill(title);
    await input.press("Enter");
  }
  const items = page.locator(".todo-list li");
  const labels = page.locator(".todo-list li label");

  await items.filter({ hasText: "Three" }).getByRole("button", { name: "Pin", exact: true }).click();
  await items.filter({ hasText: "Two" }).getByRole("button", { name: "Pin", exact: true }).click();
  await expect(labels).toHaveText(["Two", "Three", "One"]);
  await expect(items.filter({ hasText: "Two" }).locator(".pin")).toHaveText("Unpin");

  await items.filter({ hasText: "Three" }).locator(".toggle").check();
  await page.getByRole("link", { name: "Active" }).click();
  await expect(labels).toHaveText(["Two", "One"]);
  await page.getByRole("link", { name: "Completed" }).click();
  await expect(labels).toHaveText(["Three"]);

  await page.getByRole("link", { name: "All" }).click();
  await expect(page).toHaveURL("/");
  await page.reload();
  await expect(labels).toHaveText(["Two", "Three", "One"]);

  await items.filter({ hasText: "Two" }).getByRole("button", { name: "Unpin", exact: true }).click();
  await expect(labels).toHaveText(["Three", "One", "Two"]);
});
