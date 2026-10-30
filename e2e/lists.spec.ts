import { expect, test, type Page } from "@playwright/test";

async function addTodo(page: Page, title: string) {
  const input = page.getByPlaceholder("What needs to be done?");
  await input.fill(title);
  await input.press("Enter");
}

async function createList(page: Page, name: string) {
  const input = page.getByLabel("New list name");
  await input.fill(name);
  await input.press("Enter");
}

const lists = (page: Page) => page.getByRole("navigation", { name: "Lists" }).getByRole("link");

test("keeps todos saved before lists existed in a list called Todos", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem(
      "todos-nextjs",
      JSON.stringify([
        { id: 1, title: "Buy milk", completed: false },
        { id: 2, title: "Walk the dog", completed: true },
      ]),
    );
  });
  await page.reload();
  await expect(page).toHaveURL(/\/lists\/1$/);
  await expect(lists(page)).toHaveText(["Todos"]);
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk", "Walk the dog"]);
});

test("creates lists that each keep their own todos", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/lists\/1$/);
  await addTodo(page, "Buy milk");

  await createList(page, "Work");
  await expect(page).toHaveURL(/\/lists\/2$/);
  await expect(page.getByLabel("New list name")).toHaveValue("");
  await expect(lists(page)).toHaveText(["Todos", "Work"]);
  await expect(page.locator(".todo-list li")).toHaveCount(0);
  await addTodo(page, "Write report");
  await addTodo(page, "Send invoice");
  await page.locator(".todo-list li", { hasText: "Send invoice" }).getByRole("checkbox").check();
  await expect(page.locator(".todo-count")).toHaveText("1 item left");

  await page.getByRole("link", { name: "Completed" }).click();
  await expect(page).toHaveURL(/\/lists\/2\/completed$/);
  await expect(page.locator(".todo-list li")).toHaveText(["Send invoice"]);
  await page.getByRole("link", { name: "Active" }).click();
  await expect(page).toHaveURL(/\/lists\/2\/active$/);
  await expect(page.locator(".todo-list li")).toHaveText(["Write report"]);

  await lists(page).filter({ hasText: "Todos" }).click();
  await expect(page).toHaveURL(/\/lists\/1$/);
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk"]);
  await expect(page.locator(".todo-count")).toHaveText("1 item left");

  await page.goto("/lists/2/completed");
  await expect(page.locator(".todo-list li")).toHaveText(["Send invoice"]);
  await page.goto("/");
  await expect(page).toHaveURL(/\/lists\/1$/);
});

test("says when a list does not exist", async ({ page }) => {
  await page.goto("/lists/99");
  await expect(page.getByText("This list does not exist.")).toBeVisible();
  await expect(lists(page)).toHaveText(["Todos"]);
});

test("renames a list, and Escape cancels", async ({ page }) => {
  await page.goto("/");
  await createList(page, "Work");
  await page.getByRole("button", { name: "Rename Work" }).click();
  const field = page.getByLabel("List name", { exact: true });
  await expect(field).toBeFocused();
  await expect(field).toHaveValue("Work");
  await field.fill("Office");
  await field.press("Escape");
  await expect(lists(page)).toHaveText(["Todos", "Work"]);

  await page.getByRole("button", { name: "Rename Work" }).click();
  await field.fill("Office");
  await field.press("Enter");
  await expect(lists(page)).toHaveText(["Todos", "Office"]);
  await expect(page.getByRole("button", { name: "Delete Office" })).toBeVisible();

  await page.reload();
  await expect(lists(page)).toHaveText(["Todos", "Office"]);
});

test("deletes a list and its todos after confirming", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Delete Todos" })).toBeDisabled();
  await createList(page, "Work");
  await expect(page).toHaveURL(/\/lists\/2$/);
  await addTodo(page, "Write report");

  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Delete Work" }).click();
  await expect(lists(page)).toHaveText(["Todos", "Work"]);

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete Work" }).click();
  await expect(page).toHaveURL(/\/lists\/1$/);
  await expect(lists(page)).toHaveText(["Todos"]);
  await expect(page.getByRole("button", { name: "Delete Todos" })).toBeDisabled();

  await page.reload();
  await expect(lists(page)).toHaveText(["Todos"]);
  await createList(page, "Work");
  await expect(page.locator(".todo-list li")).toHaveCount(0);
});
