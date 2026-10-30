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

test("keeps existing todos in a list called Todos", async ({ page }) => {
  await page.addInitScript(() => {
    if (!window.localStorage.getItem("todos-nextjs-lists")) {
      window.localStorage.setItem("todos-nextjs", JSON.stringify([{ id: 1, title: "Old todo", completed: false }]));
    }
  });
  await page.goto("/");
  await expect(lists(page)).toHaveText(["Todos"]);
  await expect(page.locator(".todo-list li")).toHaveText(["Old todo"]);
  await page.reload();
  await expect(page.locator(".todo-list li")).toHaveText(["Old todo"]);
});

test("creates lists, switches between them, and keeps todos separate", async ({ page }) => {
  await page.goto("/");
  await addTodo(page, "Buy milk");

  await createList(page, "Work");
  await expect(page).toHaveURL("/lists/work");
  await expect(lists(page)).toHaveText(["Todos", "Work"]);
  await expect(page.getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".todo-list li")).toHaveCount(0);

  await addTodo(page, "Write report");
  await addTodo(page, "Send invoice");
  await page.locator(".todo-list li").filter({ hasText: "Send invoice" }).locator(".toggle").check();
  await expect(page.locator(".todo-count")).toHaveText("1 item left");

  await page.getByRole("link", { name: "Completed" }).click();
  await expect(page).toHaveURL("/lists/work/completed");
  await expect(page.locator(".todo-list li")).toHaveText(["Send invoice"]);
  await page.getByRole("link", { name: "Active" }).click();
  await expect(page).toHaveURL("/lists/work/active");
  await expect(page.locator(".todo-list li")).toHaveText(["Write report"]);

  await lists(page).filter({ hasText: "Todos" }).click();
  await expect(page).toHaveURL("/lists/todos");
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk"]);
  await expect(page.locator(".todo-count")).toHaveText("1 item left");

  await page.goto("/lists/work/completed");
  await expect(page.locator(".todo-list li")).toHaveText(["Send invoice"]);
  await page.goto("/");
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk"]);
});

test("explains when a list does not exist", async ({ page }) => {
  await page.goto("/lists/nope");
  await expect(page.getByText("This list does not exist.")).toBeVisible();
  await expect(lists(page)).toHaveText(["Todos"]);
});

test("renames a list with Enter and cancels with Escape", async ({ page }) => {
  await page.goto("/");
  await createList(page, "Work");
  await addTodo(page, "Write report");

  await page.getByRole("button", { name: "Rename Work" }).click();
  const field = page.getByLabel("Rename list");
  await expect(field).toBeFocused();
  await expect(field).toHaveValue("Work");
  await field.fill("Job");
  await field.press("Escape");
  await expect(field).toHaveCount(0);
  await expect(lists(page)).toHaveText(["Todos", "Work"]);

  await page.getByRole("button", { name: "Rename Work" }).click();
  await page.getByLabel("Rename list").fill("Job");
  await page.getByLabel("Rename list").press("Enter");
  await expect(lists(page)).toHaveText(["Todos", "Job"]);
  await expect(page.getByRole("button", { name: "Rename Job" })).toBeVisible();
  await expect(page).toHaveURL("/lists/work");

  await page.reload();
  await expect(lists(page)).toHaveText(["Todos", "Job"]);
  await expect(page.locator(".todo-list li")).toHaveText(["Write report"]);
});

test("deletes a list after confirming and keeps the last list", async ({ page }) => {
  await page.goto("/");
  await addTodo(page, "Buy milk");
  await createList(page, "Work");
  await addTodo(page, "Write report");

  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Delete Work" }).click();
  await expect(lists(page)).toHaveText(["Todos", "Work"]);

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete Work" }).click();
  await expect(lists(page)).toHaveText(["Todos"]);
  await expect(page).toHaveURL("/lists/todos");
  await expect(page.locator(".todo-list li")).toHaveText(["Buy milk"]);
  await expect(page.getByRole("button", { name: "Delete Todos" })).toBeDisabled();

  await page.reload();
  await expect(lists(page)).toHaveText(["Todos"]);
  await createList(page, "Work");
  await expect(page.locator(".todo-list li")).toHaveCount(0);
});

test("deleting another list keeps the open list", async ({ page }) => {
  await page.goto("/");
  await createList(page, "Work");
  await page.goto("/lists/todos");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete Work" }).click();
  await expect(lists(page)).toHaveText(["Todos"]);
  await expect(page).toHaveURL("/lists/todos");
});
