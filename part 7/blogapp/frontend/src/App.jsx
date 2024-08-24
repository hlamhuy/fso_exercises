import React, { useEffect, createRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "./reducers/notificationReducer";
import Login from "./components/Login";
import Blog from "./components/Blog";
import NewBlog from "./components/NewBlog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import { addBlog, initializeBlogs } from "./reducers/blogReducer";
import { loadUserFromStorage } from "./reducers/userReducer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import BlogDetail from "./components/BlogDetail";
import Menu from "./components/Menu";

const App = () => {
  const blogs = useSelector((state) => state.blog);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  const blogFormRef = createRef();

  const handleCreate = async (blog) => {
    dispatch(addBlog(blog));
    dispatch(
      showNotification(`Blog created: ${blog.title}, ${blog.author}`, 5)
    );
    blogFormRef.current.toggleVisibility();
  };

  if (!user) {
    return (
      <div className="container">
        <h2>blogs</h2>
        <Notification />
        <Login />
      </div>
    );
  }

  const byLikes = (a, b) => b.likes - a.likes;

  return (
    <Router>
      <div className="container">
        <Menu />
        <h2>blogs</h2>
        <Notification />
        <Routes>
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route
            path="/"
            element={
              <>
                <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                  <NewBlog doCreate={handleCreate} />
                </Togglable>
                {[...blogs].sort(byLikes).map((blog) => (
                  <Blog key={blog.id} blog={{ ...blog }} />
                ))}
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
