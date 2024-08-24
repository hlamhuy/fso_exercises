import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Blog = ({ blog }) => {
  const style = {
    border: "solid",
    padding: 5,
    borderWidth: 1,
    marginBottom: 2,
  };

  return (
    <div style={style} className="blog">
      <Link to={`/blogs/${blog.id}`}>
        <h3>
          {blog.title} - {blog.author}
        </h3>
      </Link>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.object,
  }).isRequired,
};

export default Blog;
