import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      return [...state, action.payload];
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload;
      return state.map((blog) =>
        blog.id !== updatedBlog.id ? blog : updatedBlog
      );
    },
    removeBlog(state, action) {
      const id = action.payload;
      return state.filter((blog) => blog.id !== id);
    },
    addComment(state, action) {
      const { blogId, comment } = action.payload;
      return state.map((blog) =>
        blog.id === blogId
          ? { ...blog, comments: blog.comments.concat(comment) }
          : blog
      );
    },
  },
});

export const { setBlogs, appendBlog, updateBlog, removeBlog, addComment } =
  blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const addBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog);
    dispatch(appendBlog(newBlog));
  };
};

export const voteBlog = (object) => {
  const toVote = { ...object, likes: object.likes + 1 };
  return async (dispatch) => {
    const blog = await blogService.update(toVote);
    dispatch(updateBlog(blog));
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id);
    dispatch(removeBlog(id));
  };
};

export const addBlogComment = (blogId, comment) => {
  return async (dispatch) => {
    const addedComment = await blogService.addComment(blogId, comment);
    dispatch(addComment({ blogId, comment: addedComment }));
  };
};

export default blogSlice.reducer;
