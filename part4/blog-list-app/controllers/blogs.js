const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

// GET methods
blogsRouter.get("/", async (request, response) => {
  //Blog.find({}).then((blogs) => {
  //  response.json(blogs);
  //});
  const blogs = await Blog.find({});
  response.json(blogs);
  response.status(500).end();
});

// POST methods
blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  if (!body.title || !body.url) {
    return response.status(400).json({ error: "Title and URL are required" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  });
  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

// DELETE methods
blogsRouter.delete("/:id", async (request, response, next) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

// PUT methods
blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const blog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes: body.likes },
    { new: true }
  );
  response.json(blog);
});

module.exports = blogsRouter;
