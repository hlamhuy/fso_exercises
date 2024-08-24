import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { initializeBlogs, voteBlog, deleteBlog } from "../reducers/blogReducer";
import { showNotification } from "../reducers/notificationReducer";
import storage from "../services/storage";
import CommentForm from "./CommentForm";

const BlogDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const blog = useSelector((state) =>
    state.blog.find((blog) => blog.id === id)
  );
  const canRemove = blog ? blog.user.username === storage.me() : true;

  const handleVote = async (blog) => {
    dispatch(voteBlog(blog));
    dispatch(showNotification(`You liked ${blog.title} by ${blog.author}`, 5));
  };

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(deleteBlog(blog.id));
      dispatch(
        showNotification(`Blog ${blog.title}, by ${blog.author} removed`, 5)
      );
    }
  };
  useEffect(() => {
    if (!blog) {
      dispatch(initializeBlogs());
    }
  }, [dispatch, blog]);

  if (!blog) {
    return null;
  }

  return (
    <div>
      <h2>
        {blog.title} - {blog.author}
      </h2>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes}
        <button style={{ marginLeft: 3 }} onClick={() => handleVote(blog)}>
          like
        </button>
      </div>
      <div>added by {blog.user.name}</div>
      {canRemove && <button onClick={() => handleDelete(blog)}>remove</button>}
      <h3>Comments</h3>
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>

      <CommentForm blogId={blog.id} />
    </div>
  );
};

export default BlogDetail;
