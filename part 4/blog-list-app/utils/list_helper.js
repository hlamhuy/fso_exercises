const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  return blogs.reduce((favorite, blog) => {
    return favorite.likes > blog.likes ? favorite : blog;
  });
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  const authorBlogCounts = _.countBy(blogs, "author");
  const topAuthor = _.maxBy(
    Object.keys(authorBlogCounts),
    (author) => authorBlogCounts[author]
  );
  return {
    author: topAuthor,
    blogs: authorBlogCounts[topAuthor],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authorLikesCounts = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
    return acc;
  }, {});

  const topAuthor = _.maxBy(
    Object.keys(authorLikesCounts),
    (author) => authorLikesCounts[author]
  );

  return {
    author: topAuthor,
    likes: authorLikesCounts[topAuthor],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
