import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

describe("BlogForm", () => {
  test("5.16", async () => {
    const createBlog = vi.fn();
    const user = userEvent.setup();

    const { container } = render(<BlogForm createBlog={createBlog} />);

    const titleInput = container.querySelector("#title-input");
    const authorInput = container.querySelector("#author-input");
    const urlInput = container.querySelector("#url-input");
    const submitBtn = screen.getByText("create");

    await user.type(titleInput, "Test Title");
    await user.type(authorInput, "Test Author");
    await user.type(urlInput, "http://test.com");
    await user.click(submitBtn);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0]).toStrictEqual({
      title: "Test Title",
      author: "Test Author",
      url: "http://test.com",
    });
  });
});
