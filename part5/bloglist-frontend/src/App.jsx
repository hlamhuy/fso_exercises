import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./index.css";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      setAlertMessage(null);
    } catch (exception) {
      console.error("Login failed: ", exception);
      setAlertMessage({
        message: "Hol'up! Wrong username or password!",
        type: "error",
      });
      setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
    }
  };
  const handleLogout = () => {
    setUser(null);
    blogService.setToken(null);
    window.localStorage.removeItem("loggedBlogappUser");
  };

  const createBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog));
        setAlertMessage({
          message: `a new blog \"'${blogObject.title}'\" by \"'${blogObject.author}'\" has been added`,
          type: "success",
        });
        setTimeout(() => {
          setAlertMessage(null);
        }, 5000);
      })
      .catch((error) => {
        setAlertMessage({ message: error.response.data.error, type: "error" });
        setTimeout(() => {
          setAlertMessage(null);
        }, 5000);
      });
  };
  const updateBlog = async (updatedBlog) => {
    const returnedBlog = await blogService.update(updatedBlog.id, updatedBlog);
    setBlogs(
      blogs.map((blog) => (blog.id === returnedBlog.id ? returnedBlog : blog))
    );
  };

  const removeBlog = async (id) => {
    await blogService.remove(id);
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const blogForm = () => {
    return (
      <Togglable buttonLabel="add new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
    );
  };

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification
          message={alertMessage?.message}
          type={alertMessage?.type}
        />
        {loginForm()}
      </div>
    );
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={alertMessage?.message} type={alertMessage?.type} />
      <p>
        {user.name} logged-in <button onClick={handleLogout}>logout</button>
      </p>
      {blogForm()}
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          removeBlog={removeBlog}
          currentUser={user}
        />
      ))}
    </div>
  );
};
const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return <div className={type}>{message}</div>;
};
export default App;
