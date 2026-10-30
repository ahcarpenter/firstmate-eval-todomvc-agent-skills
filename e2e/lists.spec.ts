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

const lists = (page: Page) => page.getByRole("navigation", { name: "Lists" });

test("starts with a Todos list at /", async ({ page }) => {
  await page.goto("/");
  await expect(lists(page).getByRole("link")).toHaveText(["Todos"]);
  await expect(lists(page).getByRole("link", { name: "Todos" })).toHaveAttribute("aria-current", "page");
});

test("creating a list switches to it and keeps todos separate", async ({ page }) => {
  await page.goto("/");
  await addTodo(page, "Buy milk");

  await createList(page, "Work");
  await expect(page).toHaveURL("/lists/2");
  await expect(page.getByLabel("New list name")).toHaveValue("");
  await expect(lists(page).getByRole("link")).toHaveText(["Todos", "Work"]);
  await expect(lists(page).getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".todo-list li")).toHaveCount(0);

  await addTodo(page, "Write report");
  await addTodo(page, "Email Sam");
  await expect(page.locator(".todo-count")).toHaveText("2 items left");

  await lists(page).getByRole("link", { name: "Todos" }).click();
  await expect(page).toHaveURL("/lists/1");
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk"]);
  await expect(page.locator(".todo-count")).toHaveText("1 item left");

  await page.reload();
  await lists(page).getByRole("link", { name: "Work" }).click();
  await expect(page.locator(".todo-list li")).toHaveText(["Write report", "Email Sam"]);
});

test("filters work within the current list and have list URLs", async ({ page }) => {
  await page.goto("/");
  await addTodo(page, "Buy milk");
  await createList(page, "Work");
  await expect(page).toHaveURL("/lists/2");
  await addTodo(page, "Write report");
  await addTodo(page, "Email Sam");
  await page.locator(".todo-list li").filter({ hasText: "Email Sam" }).locator(".toggle").check();

  await page.getByRole("link", { name: "Active" }).click();
  await expect(page).toHaveURL("/lists/2/active");
  await expect(page.locator(".todo-list li")).toHaveText(["Write report"]);

  await page.getByRole("link", { name: "Completed" }).click();
  await expect(page).toHaveURL("/lists/2/completed");
  await expect(page.locator(".todo-list li")).toHaveText(["Email Sam"]);

  await page.getByRole("button", { name: "Clear completed" }).click();
  await page.goto("/lists/2");
  await expect(page.locator(".todo-list li")).toHaveText(["Write report"]);
  await page.goto("/lists/1/active");
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk"]);
});

test("renaming a list keeps it across reloads, and Escape cancels", async ({ page }) => {
  await page.goto("/");
  await createList(page, "Work");
  await expect(page).toHaveURL("/lists/2");

  await lists(page).getByRole("button", { name: "Rename Work" }).click();
  const field = lists(page).getByLabel("List name", { exact: true });
  await expect(field).toBeFocused();
  await expect(field).toHaveValue("Work");
  await field.fill("Office");
  await field.press("Enter");
  await expect(lists(page).getByRole("link")).toHaveText(["Todos", "Office"]);
  await expect(lists(page).getByRole("button", { name: "Rename Office" })).toBeVisible();

  await lists(page).getByRole("button", { name: "Rename Office" }).click();
  await lists(page).getByLabel("List name", { exact: true }).fill("Something else");
  await lists(page).getByLabel("List name", { exact: true }).press("Escape");
  await expect(lists(page).getByLabel("List name", { exact: true })).toHaveCount(0);
  await expect(lists(page).getByRole("link")).toHaveText(["Todos", "Office"]);

  await page.reload();
  await expect(lists(page).getByRole("link")).toHaveText(["Todos", "Office"]);
});

test("deleting the open list asks first, then switches to the first list", async ({ page }) => {
  await page.goto("/");
  await addTodo(page, "Buy milk");
  await createList(page, "Work");
  await expect(page).toHaveURL("/lists/2");
  await addTodo(page, "Write report");
  await createList(page, "Home");
  await expect(page).toHaveURL("/lists/3");
  await lists(page).getByRole("link", { name: "Work" }).click();
  await expect(page).toHaveURL("/lists/2");

  page.once("dialog", (dialog) => dialog.dismiss());
  await lists(page).getByRole("button", { name: "Delete Work" }).click();
  await expect(lists(page).getByRole("link")).toHaveText(["Todos", "Work", "Home"]);

  let message = "";
  page.once("dialog", (dialog) => {
    message = dialog.message();
    return dialog.accept();
  });
  await lists(page).getByRole("button", { name: "Delete Work" }).click();
  expect(message).toContain("Work");
  await expect(page).toHaveURL("/lists/1");
  await expect(lists(page).getByRole("link")).toHaveText(["Todos", "Home"]);
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk"]);

  await page.reload();
  await expect(lists(page).getByRole("link")).toHaveText(["Todos", "Home"]);
  await page.goto("/lists/2");
  await expect(page.getByText("This list does not exist.")).toBeVisible();
});

test("deleting another list stays on the open list", async ({ page }) => {
  await page.goto("/");
  await createList(page, "Work");
  await expect(page).toHaveURL("/lists/2");
  page.once("dialog", (dialog) => dialog.accept());
  await lists(page).getByRole("button", { name: "Delete Todos" }).click();
  await expect(lists(page).getByRole("link")).toHaveText(["Work"]);
  await expect(page).toHaveURL("/lists/2");
});

test("the last list cannot be deleted", async ({ page }) => {
  await page.goto("/");
  await expect(lists(page).getByRole("button", { name: "Delete Todos" })).toBeDisabled();
  await createList(page, "Work");
  await expect(lists(page).getByRole("button", { name: "Delete Todos" })).toBeEnabled();
});

test("an unknown list says so", async ({ page }) => {
  await page.goto("/lists/42");
  await expect(page.getByText("This list does not exist.")).toBeVisible();
  await expect(page.getByPlaceholder("What needs to be done?")).toHaveCount(0);
});

test("todos saved before lists become a list called Todos", async ({ page }) => {
  await page.addInitScript(() => {
    if (!window.localStorage.getItem("todos-nextjs-lists")) {
      window.localStorage.setItem(
        "todos-nextjs",
        JSON.stringify([
          { id: 1, title: "Old todo", completed: false },
          { id: 2, title: "Done todo", completed: true },
        ]),
      );
    }
  });
  await page.goto("/");
  await expect(lists(page).getByRole("link")).toHaveText(["Todos"]);
  await expect(page.locator(".todo-list li")).toHaveText(["Old todo", "Done todo"]);
  await expect(page.locator(".todo-count")).toHaveText("1 item left");
});
