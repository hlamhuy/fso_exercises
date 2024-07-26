import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, updateBlog, removeBlog, currentUser }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = async () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user };
    const returnedBlog = await blogService.update(blog.id, updatedBlog);
    updateBlog(returnedBlog);
  };

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id);
      removeBlog(blog.id);
    }
  };
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  return (
    <div style={blogStyle}>
      <div>
        {blog.title} - {blog.author}{" "}
        <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
      </div>
      {visible && (
        <div className="blogDetails">
          <p>{blog.url}</p>
          <p>
            {blog.likes} likes <button onClick={handleLike}>like</button>
          </p>
          <p>{blog.user.name}</p>
          {currentUser && blog.user.username === currentUser.username && (
            <button onClick={handleRemove}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};
BlogForm.propTypes = {
  blog: PropTypes.func.isRequired,
  updateBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  currentUser: PropTypes.func.isRequired,
};
export default Blog;
