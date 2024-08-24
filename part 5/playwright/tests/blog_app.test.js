const { test, expect, beforeEach, describe } = require("@playwright/test");

const loginWith = async (page, username, password) => {
  await page.getByTestId("username").fill(username);
  await page.getByTestId("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole("button", { name: "add new blog" }).click();
  await page.fill("#title-input", title);
  await page.fill("#author-input", author);
  await page.fill("#url-input", url);
  await page.getByRole("button", { name: "create" }).click();
};

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http:localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "banhmiheoquay",
        username: "admin",
        password: "matkhau",
      },
    });
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "banhmithitnguoi",
        username: "dummyuser",
        password: "matkhaumoi",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("5.17 - Login form is shown", async ({ page }) => {
    await expect(page.getByText("username")).toBeVisible();
    await expect(page.getByText("password")).toBeVisible();
    await expect(page.getByText("login")).toBeVisible();
    await expect(page.getByText("Log in to application")).toBeVisible();
  });

  describe("5.18 - Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "admin", "matkhau");
      await expect(page.getByText("banhmiheoquay logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "admin2", "matkhau2");
      await expect(page.getByText("Wrong username or password")).toBeVisible();
    });

    describe("When logged in", () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, "admin", "matkhau");
      });

      test("5.19 - a new blog can be created", async ({ page }) => {
        await createBlog(page, "Test Title", "Test Author", "Test URL");
        await expect(page.getByText("Test Title - Test Author")).toBeVisible();
      });

      describe("After new blog added", () => {
        beforeEach(async ({ page }) => {
          await createBlog(page, "Test Title", "Test Author", "Test URL");
        });

        test("5.20 - like blog", async ({ page }) => {
          await page.getByRole("button", { name: "view" }).click();
          await page.getByRole("button", { name: "like" }).click();
          await expect(page.getByText("1 likes")).toBeVisible();
        });

        test("5.21 - remove blog", async ({ page }) => {
          await page.evaluate(() => {
            window.confirm = () => true;
          });
          await page.getByRole("button", { name: "view" }).click();
          await page.getByRole("button", { name: "remove" }).click();
          await expect(
            page.getByText("Test Title - Test Author")
          ).not.toBeVisible();
        });

        describe("multiple users test", () => {
          beforeEach(async ({ page }) => {
            await createBlog(page, "Test Title", "Test Author", "Test URL");
          });
          test("5.22 - only the user who added the blog sees the blog's delete button", async ({
            page,
          }) => {
            await page.getByRole("button", { name: "logout" }).click();
            await loginWith(page, "dummyuser", "matkhaumoi");
            await page.getByRole("button", { name: "view" }).click();
            await expect(
              page.getByRole("button", { name: "remove" })
            ).not.toBeVisible();
          });
        });
      });
    });
  });
});
