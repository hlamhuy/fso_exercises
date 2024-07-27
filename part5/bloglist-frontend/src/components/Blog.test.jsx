import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

const blog = {
  title: "First class tests",
  author: "Ahoy",
  url: "http://test.com",
  likes: 5,
  user: {
    username: "testuser",
    name: "Test User",
  },
};

describe("Blog component", () => {
  test("5.13", () => {
    render(<Blog blog={blog} currentUser={{ username: "testuser" }} />);

    const titleAuthorElement = screen.getByText("First class tests - Ahoy");
    expect(titleAuthorElement).toBeInTheDocument();
  });

  test("5.14", async () => {
    render(<Blog blog={blog} currentUser={{ username: "testuser" }} />);

    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);

    const urlElement = screen.getByText("http://test.com");
    expect(urlElement).toBeInTheDocument();

    const likesElement = screen.getByText("5 likes");
    expect(likesElement).toBeInTheDocument();
  });

  test("5.15", async () => {
    const mockHandler = vi.fn();
    render(
      <Blog
        blog={blog}
        currentUser={{ username: "testuser" }}
        updateBlog={mockHandler}
      />
    );

    const user = userEvent.setup();
    const viewButton = screen.getByText("view");
    await user.click(viewButton);
    const likeButton = screen.getByText("like");
    await user.click(likeButton);
    await user.click(likeButton);
    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
