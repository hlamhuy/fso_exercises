const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const middleware = require("../utils/middleware");

// GET methods
blogsRouter.get("/", async (request, response) => {
  //Blog.find({}).then((blogs) => {
  //  response.json(blogs);
  //});
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
  response.status(500).end();
});

// POST methods
blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  const user = request.user;
  if (!request.user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  if (!body.title || !body.url) {
    return response.status(400).json({ error: "Title and URL are required" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id,
  });

  user.blogs = user.blogs.concat(blog._id);
  await user.save();

  const savedBlog = await blog.save();
  const populatedBlog = await Blog.findById(savedBlog._id).populate("user");
  response.status(201).json(populatedBlog);
});

// DELETE methods
blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: "blog not found" });
    }

    if (blog.user.toString() !== decodedToken.id) {
      return response.status(401).json({ error: "unauthorized user" });
    }
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

// PUT methods
blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;
  const blog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes: body.likes, user: body.user.id },
    { new: true }
  ).populate("user");
  response.json(blog);
});

module.exports = blogsRouter;
