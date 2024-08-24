import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBlogComment } from "../reducers/blogReducer";

const CommentForm = ({ blogId }) => {
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (comment.trim() === "") return;
    dispatch(addBlogComment(blogId, comment));
    setComment("");
  };

  return (
    <form onSubmit={handleCommentSubmit}>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment"
      />
      <button type="submit">add comment</button>
    </form>
  );
};

export default CommentForm;
