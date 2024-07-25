const mongoose = require("mongoose");
const supertest = require("supertest");
const assert = require("node:assert");
const { test, after, beforeEach } = require("node:test");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const api = supertest(app);
const helper = require("./test_helper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let token;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("salainen", 10);
  const user = new User({ username: "root", passwordHash });
  const blogs = await Blog.insertMany(helper.initialBlogs);

  const savedUser = await user.save();
  await Promise.all(
    blogs.map(async (blog) => {
      blog.user = savedUser.id;
      await blog.save();
    })
  );
  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  };

  token = jwt.sign(userForToken, process.env.SECRET);
});

// 4.8
test("4.8", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

// 4.9
test("4.9", async () => {
  const response = await api.get("/api/blogs");
  const blogs = response.body;

  blogs.forEach((blog) => {
    assert.ok(blog.id);
    assert.strictEqual(blog._id, undefined);
  });
});

// 4.10
test("4.10", async () => {
  const newBlog = {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
    likes: 10,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((n) => n.title);
  assert(titles.includes(newBlog.title));
});

// 4.11
test("4.11", async () => {
  const newBlog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
  };

  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

// 4.12
test("4.12", async () => {
  const newBlog = {
    author: "Edsger W. Dijkstra",
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400);

  const blogsAtEnd = await helper.blogsInDb();

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

// 4.13
test("4.13", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  const titles = blogsAtEnd.map((blog) => blog.title);
  assert(!titles.includes(blogToDelete.title));
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
});

// 4.14
test("4.14", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];

  const newLikes = { likes: blogToUpdate.likes + 1 };

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newLikes)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, newLikes.likes);
});

// 4.23
test("4.23", async () => {
  const newBlog = {
    title: "Second class tests",
    author: "Me",
    url: "http://google.com",
    likes: 1,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(401)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});
after(async () => {
  await mongoose.connection.close();
});
