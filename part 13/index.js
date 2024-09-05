const express = require('express');
require('express-async-errors');
const app = express();

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const authorsRouter = require('./controllers/authors');
const listRouter = require('./controllers/readingLists');
const logoutRouter = require('./controllers/logout');

app.use(express.json());
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/readinglists', listRouter);
app.use('/api/logout', logoutRouter);

app.use((err, req, res, next) => {
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map((e) => e.message);
    return res.status(400).json({ error: errors });
  }
  next(err);
});

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
