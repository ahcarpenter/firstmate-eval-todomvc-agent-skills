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
