import { test, expect } from "@playwright/test";

test.describe("Login", () => {
  test("logs in and lands on dashboard", async ({ page }) => {
    await page.route("http://localhost:4000/users", async (route) => {
      if (route.request().method() === "POST") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            token: "fake-jwt",
            user: { id: 3, name: "admin" },
          }),
        });
      }
      return route.continue();
    });

    await page.goto("/login");
    await page.getByTestId("username").fill("admin");
    await page.getByTestId("password").fill("admin123");
    await page.getByTestId("sign-in-button").click();
    await expect(page.getByTestId("root-sites-overview")).toBeVisible();
    const storedUser = await page.evaluate(() =>
      localStorage.getItem("currentUser")
    );
    expect(storedUser).not.toBeNull();
    const user = JSON.parse(storedUser!);
    expect(user).toEqual({ id: 3, username: "admin", password: "admin123" });
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.route("http://localhost:4000/users", async (route) => {
      if (route.request().method() === "POST") {
        return route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({ message: "Invalid credentials" }),
        });
      }
      return route.continue();
    });

    await page.goto("/login");
    await page.getByTestId("username").fill("admin");
    await page.getByTestId("password").fill("admin");
    await page.getByTestId("sign-in-button").click();

    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });
});
