const router = require('express').Router();
const { User, ReadingLists } = require('../models');
const { tokenExtractor } = require('../util/middleware');

router.post('/', async (req, res) => {
  const list = ReadingLists.create(req.body);
  res.json(list);
});

router.put('/:id', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await ReadingLists.findByPk(req.params.id);
  if (user && blog && req.body.read !== undefined && user.id === blog.userId) {
    blog.read = req.body.read;
    await blog.save();
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
